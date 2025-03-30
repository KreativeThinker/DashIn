from django.urls import path
from api.views import (
    InsightList,
    InsightSearch,
    InsightsByField,
    RankingByField,
    SectorPestleTopic,
    FetchMinMaxDates,
)

urlpatterns = [
    path("insights/", InsightList.as_view(), name="insight-list"),
    path("insights/search/", InsightSearch.as_view(), name="insight-search"),
    path("utils/date-range/", FetchMinMaxDates.as_view(), name="fetch-date-range"),
    path(
        "dashboard/sector-pestle-topic",
        SectorPestleTopic.as_view(),
        name="sector-pestle-topic",
    ),
    path(
        "insights/<str:field>/",
        InsightsByField.as_view(),
        name="insights-by-field",
    ),
    path(
        "rankings/<str:field>/",
        RankingByField.as_view(),
        name="rankings-by-field",
    ),
]
