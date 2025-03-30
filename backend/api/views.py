from django.http import JsonResponse
from rest_framework import generics
from django.utils.dateparse import parse_date
from django.db.models import Count, Func, Min, Max
from rest_framework.response import Response
from rest_framework.views import APIView
from api.models import Insight
from api.serializers import InsightSerializer


class InsightList(generics.ListAPIView):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer


class InsightSearch(generics.ListAPIView):
    serializer_class = InsightSerializer

    def get_queryset(self):
        queryset = Insight.objects.all()
        query = self.request.query_params.get("q", None)
        if query:
            queryset = queryset.filter(title__icontains=query)
        return queryset


class WeekStart(Func):
    function = "DATE_TRUNC"
    template = "%(function)s('week', %(expressions)s)"


class FetchMinMaxDates(APIView):
    def get(self, request):
        result = Insight.objects.aggregate(min_date=Min("added"), max_date=Max("added"))
        return JsonResponse(result)


class RankingByField(APIView):
    def get(self, request, field):
        country = request.GET.get("country")
        limit = request.GET.get("limit")

        insights = (
            Insight.objects.exclude(**{field: None})
            .exclude(**{field: ""})
            .values(field)
            .annotate(count=Count("id"))
            .order_by("-count")
        )

        if country:
            insights = insights.filter(country=country)
        if limit:
            insights = insights[: int(limit)]
        return Response(insights)


class InsightsByField(APIView):
    def get(self, request, field):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        country = request.GET.get("country")

        insights = (
            Insight.objects.values(field)
            .annotate(week=WeekStart("added"), count=Count("id"))
            .order_by(field)
        )

        if start_date:
            insights = insights.filter(added__gte=parse_date(start_date))
        if end_date:
            insights = insights.filter(added__lte=parse_date(end_date))
        if country:
            insights = insights.filter(country=country)

        return Response(insights)


class InsightsBySector(APIView):
    def get(self, request):
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")
        country = request.GET.get("country")

        insights = (
            Insight.objects.values("sector")
            .annotate(week=WeekStart("added"), count=Count("id"))
            .order_by("week")
        )

        # Apply date filtering if parameters are provided
        if start_date:
            insights = insights.filter(added__gte=parse_date(start_date))
        if end_date:
            insights = insights.filter(added__lte=parse_date(end_date))
        if country:
            insights = insights.filter(country=country)

        return Response(insights)


class SectorPestleTopic(APIView):
    def get(self, request):
        # Count unique sector-pestle-topic groupings
        groupings = Insight.objects.values("sector", "pestle", "topic").annotate(
            count=Count("*")
        )

        # Count occurrences of each sector
        sector_counts = Insight.objects.values("sector").annotate(count=Count("id"))

        # Count occurrences of each pestle within a sector
        pestle_counts = Insight.objects.values("sector", "pestle").annotate(
            count=Count("id")
        )

        return Response(
            {
                "groupings": list(groupings),
                "sector_counts": list(sector_counts),
                "pestle_counts": list(pestle_counts),
            }
        )
