# Generated by Django 5.1.7 on 2025-03-25 12:55

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ("api", "0004_alter_insight_start_year"),
    ]

    operations = [
        migrations.AlterField(
            model_name="insight",
            name="url",
            field=models.TextField(),
        ),
    ]
