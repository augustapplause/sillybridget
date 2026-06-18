import streamlit as st
import random

def get_arithmetic(age):
    is_word = age >= 9 and random.choice([True, False])
    if is_word:
        n = random.choice(["David", "Sarah", "Leo", "Mia"])
        val1, val2 = random.randint(10, 50), random.randint(1, 9)
        return (val1 - val2), f"If {n} has {val1} apples and loses {val2}, how many are left?"
    else:
        a, b = random.randint(1, 20), random.randint(1, 20)
        return (a + b), f"What is {a} + {b}?"

def get_time():
    # 1:XX time. Minute hand positions 1-12
    pos = random.randint(1, 12)
    move = random.choice([1, 2, 3])
    target = (pos + move) % 12 or 12
    # URL Generator: using a placeholder for clock images
    img_url = f"https://img.icons8.com/color/96/000000/clock--v{pos}.png" 
    return target, f"If the minute hand is on {pos}, what number will it be on in {move*5} minutes?", img_url

def generate_question(age, category):
    # Randomize question structure: Input, True/False, or Multiple Choice
    q_style = random.choice(["input", "tf", "mc"])
    
    if category == "Arithmetic":
        ans, q_text = get_arithmetic(age)
        return {"ans": ans, "q": q_text, "style": q_style, "type": "Arithmetic"}
    elif category == "Time":
        ans, q_text, img = get_time()
        return {"ans": ans, "q": q_text, "style": q_style, "type": "Time", "img": img}
    else: # Geometry
        shapes = [("Square", 4), ("Triangle", 3), ("Pentagon", 5), ("Hexagon", 6)]
        name, sides = random.choice(shapes)
        return {"ans": sides, "q": f"How many sides does a {name} have?", "style": q_style, "type": "Geometry"}

# --- App Logic ---
if 'state' not in st.session_state:
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.q_data = generate_question(7, "Arithmetic")

st.title("🧮 Kids Math Master")

# Display Question
data = st.session_state.q_data
st.write(f"**{data['q']}**")

if "img" in data: st.image(data['img'], width=100)

# Answer Format Logic
user_ans = None
if data['style'] == "tf":
    user_ans = st.radio("True or False?", [True, False])
    # Logic to map True/False to actual answer
elif data['style'] == "mc":
    options = sorted(list(set([data['ans'], data['ans']+2, data['ans']-1, data['ans']+5])))
    user_ans = st.selectbox("Choose the correct answer:", options)
else:
    user_ans = st.number_input("Answer:", value=None)

if st.button("Submit"):
    # Scoring logic...
    st.session_state.q_count += 1
    st.session_state.q_data = generate_question(7, "Arithmetic")
    st.rerun()