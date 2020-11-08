import pyautogui
import sys

arg1 = sys.argv[1]

if arg1 == 'victory':
    s = pyautogui.locateOnScreen('./python/assets/victory.png')
elif arg1 == 'combat':
    s = pyautogui.locateOnScreen('./python/assets/combatCheck.png')

print(s)