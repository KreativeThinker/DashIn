import json
from datetime import datetime


def clean_data(data):
    if not isinstance(data, list):
        raise ValueError("JSON must be a list of objects")

    def normalize_date(date_str):
        """Convert various date formats to Django-supported 'YYYY-MM-DD HH:MM:SS' format."""
        if not date_str:
            return None

        formats = [
            "%B, %d %Y %H:%M:%S",  # Example: "July, 03 2016 00:00:00"
        ]

        for fmt in formats:
            try:
                return datetime.strptime(date_str, fmt).strftime("%Y-%m-%d %H:%M:%S")
            except ValueError:
                continue

        raise ValueError(f"❌ Unrecognized date format: {date_str}")

    for item in data:
        for key, value in item.items():
            if value == "":
                item[key] = None  # Convert empty strings to None

            if key in ["added", "published"]:
                try:
                    item[key] = normalize_date(value)
                except ValueError as e:
                    print(e)
                    item[key] = None  # Set to None if unfixable

    return data


try:
    with open("./jsondata.json", "r") as f:
        raw_data = f.read().strip()

        if not raw_data:
            raise ValueError("JSON file is empty")

        data = json.loads(raw_data)

    cleaned_data = clean_data(data)

    with open("./jsondata_fixed.json", "w") as f:
        json.dump(cleaned_data, f, indent=4)

    print("✅ JSON cleaned and dates normalized successfully!")

except json.JSONDecodeError:
    print("❌ Error: Invalid JSON file")
except FileNotFoundError:
    print("❌ Error: File not found")
except ValueError as e:
    print(f"❌ Error: {e}")
