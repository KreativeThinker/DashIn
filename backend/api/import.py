import json
from api.models import Insight

with open("./jsondata_fixed.json", "r") as f:
    data = json.load(f)

for i in data:
    Insight.objects.create(**i)
