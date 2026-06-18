import streamlit as st
import random

# UI Configuration
st.set_page_config(page_title="Kids Math Master", page_icon="🧮", layout="centered")

def get_arithmetic_question(age):
    # Word problems or simple equations
    if age >= 9 and random.random() > 0.5:
        n = random.choice(["David", "Sarah", "Leo"])
        v1, v2 = random.randint(10, 50), random.randint(1, 9)
        return (v1 - v2), f"If {n} has {v1} apples and loses {v2}, how many are left?"
    else:
        v1, v2 = random.randint(1, 20), random.randint(1, 20)
        return (v1 + v2), f"What is {v1} + {v2}?"

def generate_question(age, category):
    style = random.choice(["input", "tf", "mc"])
    
    if category == "Arithmetic":
        ans, q_text = get_arithmetic_question(age)
    elif category == "Time":
        pos = random.randint(1, 12)
        move = random.choice([1, 2, 3])
        ans = (pos + move) % 12 or 12
        q_text = f"If the minute hand is on {pos}, what number will it be on in {move*5} minutes?"
    else: # Geometry
        shapes = {"Square": 4, "Triangle": 3, "Pentagon": 5, "Hexagon": 6}
        name = random.choice(list(shapes.keys()))
        ans, q_text = shapes[name], f"How many sides does a {name} have?"

    # Logical True/False formatting
    if style == "tf":
        is_true = random.choice([True, False])
        display_ans = ans if is_true else ans + random.choice([-2, 2, 3])
        return {"q": f"{q_text} Is the answer {display_ans}?", "ans": is_true, "style": "tf"}
    
    return {"q": q_text, "ans": ans, "style": style}

# --- Main App ---
st.title("🧮 Kids Math Master")
st.markdown("---")

# Initialization
if 'q_count' not in st.session_state:
    st.session_state.update({'score': 0, 'q_count': 0, 'q_data': generate_question(7, "Arithmetic")})

# Sidebar
with st.sidebar:
    st.header("⚙️ Settings")
    age = st.slider("Age Level", 5, 12, 7)
    cat = st.selectbox("Topic", ["Arithmetic", "Time", "Geometry"])
    if st.button("🔄 Reset Quiz"):
        st.session_state.update({'score': 0, 'q_count': 0, 'q_data': generate_question(age, cat)})
        st.rerun()

# Quiz Logic
if st.session_state.q_count < 10:
    data = st.session_state.q_data
    st.subheader(f"Question {st.session_state.q_count + 1} / 10")
    st.info(data['q'])
    
    # Input Mapping
    user_ans = None
    if data['style'] == "tf":
        user_ans = st.radio("Select your answer:", [True, False], index=None, horizontal=True)
    elif data['style'] == "mc":
        opts = sorted(list({data['ans'], data['ans']+2, data['ans']-1, data['ans']+3}))
        user_ans = st.selectbox("Select your answer:", opts, index=None)
    else:
        user_ans = st.number_input("Enter your answer:", value=None, placeholder="Type here...")

    if st.button("🚀 Submit Answer", type="primary"):
        if user_ans == data['ans']:
            st.session_state.score += 1
            st.success("Correct! Well done! 🎉")
        else:
            st.error(f"Not quite. The correct answer was {data['ans']}.")
        
        st.session_state.q_count += 1
        st.session_state.q_data = generate_question(age, cat)
        st.button("Next Question", on_click=st.rerun)
else:
    st.balloons()
    st.success(f"## Quiz Complete! Final Score: {st.session_state.score} / 10")