import streamlit as st
import random

def generate_question(age, category):
    if category == "Arithmetic":
        limit = 20 if age < 9 else 100
        ops = ['+', '-'] if age < 9 else ['+', '-', '×', '÷']
        op = random.choice(ops)
        if op == '+':
            a, b = random.randint(1, limit), random.randint(1, limit)
            return a + b, f"What is {a} + {b}?"
        elif op == '-':
            a, b = random.randint(1, limit), random.randint(1, limit)
            a, b = max(a, b), min(a, b)
            return a - b, f"What is {a} - {b}?"
        elif op == '×':
            a, b = random.randint(1, 12), random.randint(1, 12)
            return a * b, f"What is {a} × {b}?"
        else:
            b = random.randint(1, 12)
            a = b * random.randint(1, 12)
            return a // b, f"What is {a} ÷ {b}?"
    elif category == "Time":
        # Logic fix: Ensure minutes are 0-59
        start_min = random.randint(0, 50)
        change = random.choice([5, 10, 15, 20])
        op = random.choice(['+', '-'])
        if op == '+':
            ans = (start_min + change) % 60
            return ans, f"If it is 1:00, what is the minute hand position {change} minutes later? (e.g., 10)"
        else:
            # For subtraction, ensure we don't go negative by adjusting the start
            start_min = random.randint(20, 59)
            ans = (start_min - change) % 60
            return ans, f"If it is 1:{start_min:02d}, what was the minute hand position {change} minutes ago? (e.g., {ans})"
    elif category == "Geometry":
        shapes = {"Square": 4, "Triangle": 3, "Pentagon": 5, "Hexagon": 6}
        name = random.choice(list(shapes.keys()))
        return shapes[name], f"How many sides does a {name} have?"

st.title("🧮 Kids Math Master")

if 'score' not in st.session_state:
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.answer, st.session_state.question = generate_question(7, "Arithmetic")

st.sidebar.header("Quiz Settings")
age = st.sidebar.slider("Select Age:", 5, 12, 7)
category = st.sidebar.selectbox("Category:", ["Arithmetic", "Time", "Geometry"])

if st.sidebar.button("Start New Quiz"):
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.answer, st.session_state.question = generate_question(age, category)
    st.rerun()

if st.session_state.q_count < 10:
    st.write(f"### Question {st.session_state.q_count + 1} of 10")
    if category == "Geometry":
        st.image("http://googleusercontent.com/image_collection/image_retrieval/18179145998193734315_0", width=300)
    
    st.write(f"**{st.session_state.question}**")
    
    # Using a unique key per question forces the widget to reset
    user_input = st.number_input("Your Answer:", value=None, key=st.session_state.q_count)
    
    if st.button("Submit"):
        if user_input == st.session_state.answer:
            st.session_state.score += 1
            st.success("Correct!")
        else:
            st.error(f"Not quite. The answer was {st.session_state.answer}.")
        
        st.session_state.q_count += 1
        if st.session_state.q_count < 10:
            if st.button("Next Question"):
                st.session_state.answer, st.session_state.question = generate_question(age, category)
                st.rerun()
        else:
            st.rerun()
else:
    st.write(f"## Final Score: {st.session_state.score} / 10")
    if st.button("Play Again"):
        st.session_state.score = 0
        st.session_state.q_count = 0
        st.rerun()