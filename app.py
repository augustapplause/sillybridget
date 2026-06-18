import streamlit as st
import random

# Function to generate questions
def generate_question(age, category):
    if category == "Arithmetic":
        # Adjust difficulty by age
        limit = 20 if age < 9 else 100
        ops = ['+', '-'] if age < 9 else ['+', '-', '×', '÷']
        op = random.choice(ops)
        
        if op == '+':
            a, b = random.randint(1, limit), random.randint(1, limit)
            return a + b, f"What is {a} + {b}?"
        elif op == '-':
            a, b = random.randint(1, limit), random.randint(1, limit)
            if a < b: a, b = b, a
            return a - b, f"What is {a} - {b}?"
        elif op == '×':
            a, b = random.randint(1, 12), random.randint(1, 12)
            return a * b, f"What is {a} × {b}?"
        else: # Division
            b = random.randint(1, 12)
            a = b * random.randint(1, 12)
            return a // b, f"What is {a} ÷ {b}?"
            
    elif category == "Time":
        start_min = random.randint(0, 50)
        change = random.choice([5, 10, 15, 20])
        op = random.choice(['+', '-'])
        if op == '+':
            return start_min + change, f"If it is 1:00, what is it {change} minutes later? (Answer with minutes, e.g., {start_min + change})"
        else:
            return start_min, f"If it is 1:{(start_min + change):02d}, what was it {change} minutes ago? (Answer with minutes, e.g., {start_min})"

    elif category == "Geometry":
        shapes = {"Square": 4, "Triangle": 3, "Pentagon": 5, "Hexagon": 6}
        name = random.choice(list(shapes.keys()))
        return shapes[name], f"How many sides does a {name} have?"

# --- App Initialization ---
st.title("🧮 Kids Math Master")

if 'score' not in st.session_state:
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.answered = False
    st.session_state.feedback = None
    st.session_state.category = "Arithmetic"
    st.session_state.age = 7
    st.session_state.answer, st.session_state.question = generate_question(7, "Arithmetic")

# Sidebar
st.sidebar.header("Quiz Settings")
age = st.sidebar.slider("Select Age:", 5, 12, st.session_state.age)
category = st.sidebar.selectbox("Category:", ["Arithmetic", "Time", "Geometry"])

if st.sidebar.button("Start New Quiz"):
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.age = age
    st.session_state.category = category
    st.session_state.answer, st.session_state.question = generate_question(age, category)
    st.rerun()

# Quiz Logic
if st.session_state.q_count < 10:
    st.write(f"### Question {st.session_state.q_count + 1} of 10")
    
    if st.session_state.category == "Geometry":
        st.image("http://googleusercontent.com/image_collection/image_retrieval/18179145998193734315_0", width=300)
    
    st.write(f"**{st.session_state.question}**")
    
    # Empty default value via key handling
    user_input = st.number_input("Your Answer:", value=None, placeholder="Type a number...")
    
    if st.button("Submit Answer"):
        if user_input is not None:
            if user_input == st.session_state.answer:
                st.session_state.score += 1
                st.success("Correct! Well done! 🎉")
            else:
                st.error(f"Not quite. The correct answer was {st.session_state.answer}.")
            
            st.session_state.q_count += 1
            if st.session_state.q_count < 10:
                if st.button("Next Question"):
                    st.session_state.answer, st.session_state.question = generate_question(st.session_state.age, st.session_state.category)
                    st.rerun()
            else:
                st.rerun()
else:
    st.success(f"Quiz Complete! Final Score: {st.session_state.score} / 10")
    if st.button("Play Again"):
        st.session_state.score = 0
        st.session_state.q_count = 0
        st.rerun()