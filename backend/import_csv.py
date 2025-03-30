import csv

from api.models import Country

with open("iso.csv", newline="") as file:
    reader = csv.reader(file)
    next(reader)
    countries = [Country(name=row[0], iso=row[1], code=row[2]) for row in reader]

Country.objects.bulk_create(countries)
