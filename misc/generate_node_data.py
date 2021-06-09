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

N = 400 # Number of nodes.

# Base values form which a random node is constructed
tags = ["AWS", "Cloud", "Data", "Networking", "IoT", "Compliance", "ML", "Office", "Web", "Mobile", "Security", "Shell", "Content Delivery", "Google Cloud", "Container", "Identity"]
deps = ["Development", "Testing", "Operations", "Service Desk", "ML", "App", "Web", "Research", "HR", "Cloud", "Finance", "Controlling", "Customer Support", "Sales", "Delivery", "Logistics", "Procurement"]
license = ["Open Source", "AWS001", "AWS002", "Apache 2.0", "Amazon Digital Services", "BSD-4", "W3C Software v1.0"]
owner = ["Hawkins", "Carson", "Frazier", "Armstrong", "Simpson", "Mack", "Diaz", "Greene", "Lane", "Stone"]
name1 = ["Avist ", "AWS ", "MS ", "Lambda ", "Q", "Hover", "Moover", "Hut", "Sol", "BusinessOne ", "Cloud", "AMX ", "Lander ", "Shift4", "Lit", "Log"]
name2 = ["Vista", "Tagger", "Suite", "Pro", "Allocate", "Micro", "Server", "Enigma" , "Engine", "Infinity", "Macro", "Titan", "Over", "Cubed", "Plugin", "Vision", "AI", "ML", "Deep", "Soft", "Dev", "Path", "Wise", "Controller", "Zone", "Electric", "Connect", "Nest", "Auto", "Scope", "Project", "Tetra", "Shifter", "Tool", "Reboot", "Sail", "Mobile", "Operator", "Air", "Sonic", "Binary", "Pivot", "Domain"]
cat = ["BI", "GEN", "ERP", "EMS", "CRM"]


def generate_element(cat):
    tag = f'"{random.choice(cat)}"'
    return tag

def generate_list(cat):
    out = "[ "
    for i in range(random.randint(0, 5)):
        out += generate_element(cat) + ","
    return out[:-1] + "]"

def generate_id():
    return 1622831000000 + random.randint(100000, 999999)

def generate_name():
    return f"{random.choice(name1)}{random.choice(name2)}"

def generate_cat():
    return random.choice(cat)

def generate_desc():
    return "One of the most popular Windows compatible FTP clients, WinSCP supports FTP, SFTP, WebDAV and SCP connections."

def generate_version():
    return f"{random.randint(0,10)}.{random.randint(0,5)}"

def generate_date():
    year = random.choice([2020, 2021, 2022, 2023, 2021, 2021, 2021, 2022, 2022, 2021])
    month = random.randint(1, 12)
    day = random.randint(1, 30)
    return f"{year}-{month}-{day}"

def generate_node():
    temp = '{"tags": '+generate_list(tags)+','
    temp += f'"departments": {generate_list(deps)},'
    temp += f'"_id": {generate_id()},'
    temp += f'"name": "{generate_name()}",'
    temp += f'"category": "{generate_cat()}",'
    temp += f'"desc": "{generate_desc()}",'
    temp += f'"version": "{generate_version()}",'
    temp += f'"license": "{random.choice(license)}",'
    temp += f'"profOwner": "{random.choice(owner)}",'
    temp += f'"techOwner": "{random.choice(owner)}",'
    temp += f'"loc": "{random.randint(-1000, 1000)} {random.randint(-1000, 1000)}",'
    temp += f'"shutdownDate": "{generate_date()}",'
    temp += f'"startDate": "{generate_date()}"'
    temp += "}"
    return temp

def generate_node_data_array(n):
    node_array_string = '['
    for _ in range(n):
        node_array_string += generate_node() + ','
    return node_array_string[:-1] + ']'


print(generate_node_data_array(n=N))
