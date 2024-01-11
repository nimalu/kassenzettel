import csv
import random

def generate_receipt(itemsList):
    item_length = int(max(1, random.normalvariate(12, 10)))
    items_base = random.choices(itemsList, k=item_length)
    taxClasses = random.choice([["A", "B"], ["E", "F"]])

    items = []
    for (name, price) in items_base:
        items.append({
            "name": name,
            "price": round(random.normalvariate(price, price*0.5), 2),
            "taxClass": random.choice(taxClasses)
        })
    return {
        "items": items,
        "layoutBase": random.choice(["lidl", "real"]),
        "card": random.choice([True, False]),
        "layout": {
            "font": random.choice(["Inconsolata", "DejaVuSansMono"]),
            "qrcode": random.choice([True, False]),
            "barcode": random.choice([True, False]),
        }
    }

def read_items_ds(f):
    reader = csv.reader(f)
    next(reader)
    return [(row[0], float(row[1])) for row in reader]

def generate_receipts(length):
    with open("./data/items.csv", "r") as file:
        itemsList = read_items_ds(file)

    return [generate_receipt(itemsList) for _ in range(length)]