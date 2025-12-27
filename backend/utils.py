from typing import Tuple, Optional

COFFEE_LEVELS = [
  {'id': '1', 'name': 'Новичок', 'pointsRequired': 0},
  {'id': '2', 'name': 'Кофеман', 'pointsRequired': 100},
  {'id': '3', 'name': 'Бариста-Шеф', 'pointsRequired': 250},
  {'id': '4', 'name': 'Магистр Эспрессо', 'pointsRequired': 500},
  {'id': '5', 'name': 'Кофейный Монарх', 'pointsRequired': 1000},
]

def get_level_info(points: int) -> dict:
    # Find the highest level with pointsRequired <= points
    current_level = COFFEE_LEVELS[0]
    for level in COFFEE_LEVELS:
        if points >= level['pointsRequired']:
            current_level = level
        else:
            break
    return current_level

def get_next_level_points(points: int) -> int:
    for level in COFFEE_LEVELS:
        if level['pointsRequired'] > points:
            return level['pointsRequired']
    
    # If max level reachable, return the max level points or some cap
    return COFFEE_LEVELS[-1]['pointsRequired']

def calculate_user_level(lifetime_points: int) -> Tuple[str, int]:
    """Returns (level_name, next_level_points)"""
    level_info = get_level_info(lifetime_points)
    next_points = get_next_level_points(lifetime_points)
    return level_info['name'], next_points
