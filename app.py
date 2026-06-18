import streamlit as st
import random

def generate_question(age, category):
    # Arithmetic logic
    if category == "Arithmetic":
        limit = 20 if age < 9 else 100
        ops = ['+', '-', '×', '÷'] if age >= 9 else ['+', '-']
        op = random.choice(ops)
        if op == '+':
            a, b = random.randint(1, limit), random.randint(1, limit)
            return a + b, f"What is {a} + {b}?"
        elif op == '-':
            a, b = random.randint(1, limit), random.randint(1, limit)
            a, b = max(a, b), min(a, b)
            return a - b, f"What is {a} - {b}?"
        elif op == '×':
            a, b = random.randint(1, 10), random.randint(1, 10)
            return a * b, f"What is {a} × {b}?"
        else:
            b = random.randint(1, 10)
            a = b * random.randint(1, 10)
            return a, f"What is {a} ÷ {b}?" # Simplified division
            
    # Time logic (Fixed)
    elif category == "Time":
        start_min = random.randint(0, 45)
        change = random.choice([5, 10, 15, 20])
        # Simple "minutes past the hour" logic
        return (start_min + change), f"If it is 1:00, what minute is it {change} minutes later? (Just enter the number)"

    # Geometry logic
    else:
        shapes = {"Square": 4, "Triangle": 3, "Pentagon": 5, "Hexagon": 6}
        name = random.choice(list(shapes.keys()))
        return shapes[name], f"How many sides does a {name} have?"

# --- App State Init ---
if 'score' not in st.session_state:
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.current_ans, st.session_state.current_q = generate_question(7, "Arithmetic")

st.title("🧮 Kids Math Master")

# Sidebar
age = st.sidebar.slider("Select Age:", 5, 12, 7)
category = st.sidebar.selectbox("Category:", ["Arithmetic", "Time", "Geometry"])

if st.sidebar.button("Start New Quiz"):
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.current_ans, st.session_state.current_q = generate_question(age, category)
    st.rerun()

# Quiz UI
if st.session_state.q_count < 10:
    st.write(f"### Question {st.session_state.q_count + 1} of 10")
    st.write(f"**{st.session_state.current_q}**")
    
    # Form to handle submission
    with st.form(key=f"q_{st.session_state.q_count}", clear_on_submit=True):
        user_input = st.number_input("Your Answer:", step=1)
        submit_button = st.form_submit_button("Submit")
        
        if submit_button:
            if user_input == st.session_state.current_ans:
                st.session_state.score += 1
                st.success("Correct!")
            else:
                st.error(f"Not quite. The answer was {st.session_state.current_ans}.")
            
            st.session_state.q_count += 1
            # Generate next question immediately after submit
            st.session_state.current_ans, st.session_state.current_q = generate_question(age, category)
            st.info("Click Submit to move to the next question.")
            if st.form_submit_button("Next Question"):
                st.rerun()
else:
    st.write(f"## Quiz Complete! Final Score: {st.session_state.score} / 10")
    if st.button("Play Again"):
        st.session_state.score = 0
        st.session_state.q_count = 0
        st.rerun()