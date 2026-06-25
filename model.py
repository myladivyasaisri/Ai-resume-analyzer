# model.py (logic / scoring engine)

def ats_model_score(skills_found, total_skills):
    """
    Simple AI scoring logic (can replace with ML later)
    """

    if total_skills == 0:
        return 0

    score = (len(skills_found) / total_skills) * 100

    # Boost system (extra marks)
    if len(skills_found) > 8:
        score += 5
    if len(skills_found) > 12:
        score += 10

    return min(int(score), 100)


def rank_profile(score):
    """
    Resume ranking level
    """

    if score >= 80:
        return "Excellent 🔥"
    elif score >= 60:
        return "Good 👍"
    elif score >= 40:
        return "Average ⚡"
    else:
        return "Needs Improvement ❌"