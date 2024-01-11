import csv
import random

def generate_receipt(itemsList, cities, streets):
    item_length = int(max(1, random.normalvariate(12, 10)))
    items_base = random.choices(itemsList, k=item_length)
    taxClasses = random.choice([["A", "B"], ["E", "F"], ["A", "B", "C"]])

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
        "address": random_address(cities, streets),
        "detail1": random_detail1(),
        "layout": {
            "font": random.choice(["Inconsolata", "DejaVuSansMono"]),
            "qrcode": random.choice([True, False]),
            "barcode": random.choice([True, False]),
            "background": random_receipt_color(),
            "barcodeHeight": f"{random.randint(10, 120)}px",
            "px": f"{random.randint(8, 30)}px",
            "py": f"{random.randint(8, 50)}px",
        }
    }

def random_address(cities, streets):
    city = random.choice(cities)
    street = random.choice(streets)
    number = random.randint(1, 120)
    postcode = random.randint(20000, 88888)
    opening_times = random.choice([
        "Mo-So 7:30-19 Uhr",
        "Mo-Fr 8-16 Sa-So geschlossen",
        "Mo-Fr 8-18 Sa 9-16"
    ])
    return random.choice([
        f"{street} {number}\n{postcode} {city}",
        f"{street} {number}\n{postcode} {city}\n{opening_times}"
    ])

def random_receipt_color():
    h = int(random.normalvariate(215, 20))
    s = random.randint(19, 95)
    l = random.randint(90, 100)
    return f"hsl({h}, {s}%, {l}%)"

def random_detail1():
    return ""

def read_items_ds(f):
    reader = csv.reader(f)
    next(reader)
    return [(row[0], float(row[1])) for row in reader]

def generate_receipts(length):
    with open("./data/items.csv", "r") as file:
        itemsList = read_items_ds(file)
    with open("./data/cities.csv", "r") as file:
        cities = list([r[0] for r in csv.reader(file)])
    with open("./data/streets.csv", "r") as file:
        streets = list([r[0] for r in csv.reader(file)])

    return [generate_receipt(itemsList, cities, streets) for _ in range(length)]