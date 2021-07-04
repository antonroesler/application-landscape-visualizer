"""
Copyright (c) 2021 Ecore. All rights reserved.

University:        Frankfurt University of Applied Sciences
Study program:     Engineering Business Information Systems
Module:            Advanced Programming 2021
Professor:         Prof. Dr. Jung, Prof. Dr. Bremm
Date:              21.04.2021


Script to generate a nodeDataArray with random (realistic) values.

N Determines the size of the array (number of nodes).
"""
__author__ = "Anton Roesler"

import random
import lorem

N = 100 # Number of nodes.

# Base values form which a random node is constructed
tags = ["Cloud", "Data", "IoT", "Compliance", "ML", "Office", "Web", "Mobile", "Security", "Shell", "Content Delivery", "Container", "Identity"]
deps = ["Development", "Testing", "Operations", "Service Desk", "Analytics", "Web", "Research", "HR", "Finance", "Controlling", "Customer Support", "Sales", "Delivery", "Logistics"]
license = ["Open Source", "AWS001", "AWS002", "Apache 2.0", "Digital Service", "BSD-4", "W3C Software"]
owners = ["Hawkins", "Carson", "Frazier", "Armstrong", "Simpson", "Mack", "Diaz", "Greene", "Lane", "Stone"]
name1 = ["Data ", "AWS ", "MS ", "Lambda ", "Q", "Hover", "Moover", "Hut", "Sol", "BusinessOne ", "Cloud", "Elastic ", "Lander ", "Shift4", "Media ", "Log"]
name2 = ["Pipeline", "Tagger", "Suite", "Pro", "Allocate", "Micro", "Server", "Enigma" , "Engine", "Infinity", "Macro", "Titan", "Over", "Cubed", "Plugin", "Vision", "AI", "ML", "Deep", "Soft", "Dev", "Path", "Wise", "Controller", "Zone", "Electric", "Connect", "Nest", "Auto", "Scope", "Project", "Tetra", "Shifter", "Tool", "Reboot", "Sail", "Mobile", "Operator", "Air", "Sonic", "Binary", "Pivot", "Domain"]
cats = ["BI", "GEN", "ERP", "EMS", "CRM"]


def probability_table(attr1, attr2):
    table = dict()
    for element in attr1:
        probs=[random.randint(0, 100) for _ in attr2]
        s = sum(probs)
        probs=[x/s for x in probs]
        table[element] = probs
    return table

pt_owner_owner = probability_table(owners, owners)
pt_owner_deps = probability_table(owners, deps)
pt_owner_tags = probability_table(owners, tags)
pt_ower_cat = probability_table(owners, cats)
pt_owner_license = probability_table(owners, license)

def generate_element(cat, weights):
    tag = f'"{random.choices(cat, weights=weights)[0]}"'
    return tag

def generate_list(cat, p):
    out = "[ "
    for i in range(random.randint(0, 3)):
        out += generate_element(cat, p) + ","
    return out[:-1] + "]"

def generate_id():
    return 1622831000000 + random.randint(100000, 999999)

def generate_name():
    return f"{random.choice(name1)}{random.choice(name2)}"

def generate_cat(tech):
    return random.choices(cats, weights=pt_ower_cat[tech])[0]

def generate_desc():
    return lorem.sentence() 

def generate_version():
    return f"{random.randint(0,10)}.{random.randint(0,5)}"

def generate_date(higher=None):
    year = random.choice([2020, 2021, 2022, 2023, 2021, 2021, 2021, 2022, 2022, 2021])
    month = random.randint(1, 12)
    day = random.randint(1, 30)
    if higher and year < int(higher):
        return generate_date
    return f"{year}-{month:02}-{day:02}"

def generate_owner(owner):
    return random.choices(owners, weights=pt_owner_owner[owner])[0]

def generate_node():
    prof = random.choice(owners)
    tech = generate_owner(prof)
    tag = generate_list(tags, pt_owner_tags[tech])
    dep = generate_list(deps, pt_owner_deps[tech])
    start = generate_date()

    temp = '{"tags": '+tag+','
    temp += f'"departments": {dep},'
    temp += f'"key": {generate_id()},'
    temp += f'"name": "{generate_name()}",'
    temp += f'"category": "{generate_cat(tech)}",'
    temp += f'"desc": "{generate_desc()}",'
    temp += f'"version": "{generate_version()}",'
    temp += f'"license": "{random.choices(license, weights=pt_owner_license[prof])[0]}",'
    temp += f'"profOwner": "{prof}",'
    temp += f'"techOwner": "{tech}",'
    temp += f'"loc": "{random.randint(-1000, 1000)} {random.randint(-1000, 1000)}",'
    temp += f'"shutdownDate": "{generate_date(higher=start[:4])}",'
    temp += f'"startDate": "{start}"'
    temp += "}"
    return temp

def generate_node_data_array(n):
    node_array_string = '['
    for _ in range(n):
        node_array_string += generate_node() + ','
    return node_array_string[:-1] + ']'


print(generate_node_data_array(n=N))


