import streamlit as st
import random

def generate_question(category):
    """Generates a question based on selected category."""
    if category == "Arithmetic":
        ops = ['+', '-', '×', '÷']
        op = random.choice(ops)
        if op == '+':
            a, b = random.randint(1, 20), random.randint(1, 20)
            return a + b, f"What is {a} + {b}?"
        elif op == '-':
            a, b = random.randint(5, 20), random.randint(1, 5)
            return a - b, f"What is {a} - {b}?"
        elif op == '×':
            a, b = random.randint(1, 10), random.randint(1, 10)
            return a * b, f"What is {a} × {b}?"
        else: # Division
            b = random.randint(1, 10)
            a = b * random.randint(1, 10)
            return a // b, f"What is {a} ÷ {b}?"
            
    elif category == "Time":
        start_min = random.randint(0, 50)
        change = random.choice([5, 10, 15, 20])
        op = random.choice(['+', '-'])
        if op == '+':
            return start_min + change, f"If it is 1:00, what time is it {change} minutes later? (Answer with the number of minutes, e.g., 10)"
        else:
            return start_min, f"If it is 1:{(start_min + change):02d}, what time was it {change} minutes ago? (Answer with the number of minutes, e.g., 10)"

    elif category == "Geometry":
        shapes = {"Square": 4, "Triangle": 3, "Pentagon": 5, "Hexagon": 6}
        name = random.choice(list(shapes.keys()))
        return shapes[name], f"How many sides does a {name} have?"

# --- App Logic ---
st.title("🧮 Kids Math Master")

if 'score' not in st.session_state:
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.category = "Arithmetic"
    st.session_state.answer, st.session_state.question = generate_question("Arithmetic")

# Sidebar Configuration
st.sidebar.header("Quiz Settings")
category = st.sidebar.selectbox("Choose Category:", ["Arithmetic", "Time", "Geometry"])
if st.sidebar.button("Start New Quiz"):
    st.session_state.score = 0
    st.session_state.q_count = 0
    st.session_state.category = category
    st.session_state.answer, st.session_state.question = generate_question(category)
    st.rerun()

# Quiz Flow
if st.session_state.q_count < 20:
    st.write(f"### Question {st.session_state.q_count + 1} of 20")
    
    # Display image if Geometry is selected
    if st.session_state.category == "Geometry":
        st.image("http://googleusercontent.com/image_collection/image_retrieval/18179145998193734315_0", caption="Shape Reference", width=300)
    
    st.write(f"**{st.session_state.question}**")
    
    with st.form("quiz_form", clear_on_submit=True):
        user_answer = st.number_input("Your Answer:", step=1)
        submitted = st.form_submit_button("Submit")
        
        if submitted:
            if user_answer == st.session_state.answer:
                st.session_state.score += 1
            st.session_state.q_count += 1
            if st.session_state.q_count < 20:
                st.session_state.answer, st.session_state.question = generate_question(st.session_state.category)
                st.rerun()
            else:
                st.rerun()
else:
    st.success(f"Quiz Complete! Your final score is {st.session_state.score} / 20")
    if st.button("Play Again"):
        st.session_state.score = 0
        st.session_state.q_count = 0
        st.rerun()