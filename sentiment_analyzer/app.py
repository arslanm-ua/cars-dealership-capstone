"""
Sentiment Analyzer microservice.

A small, self-contained Flask app that performs lexicon-based sentiment
analysis on English text. No external downloads (no nltk/textblob corpora)
so it works fine offline / inside a minimal container.

API contract:
    GET /analyze/<text>  -> {"sentiment": "positive|negative|neutral", "text": <text>, "score": <float>}
    GET /                -> {"status": "Sentiment Analyzer is running"}
"""

import re

from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # allow all origins - other local services / browsers call this cross-origin

# ---------------------------------------------------------------------------
# Lexicons
# ---------------------------------------------------------------------------

POSITIVE_WORDS = {
    "great", "excellent", "fantastic", "love", "loved", "loves", "amazing",
    "friendly", "helpful", "recommend", "recommended", "happy", "smooth",
    "professional", "quick", "fast", "fair", "awesome", "wonderful",
    "outstanding", "perfect", "pleasant", "polite", "courteous", "clean",
    "honest", "reliable", "trustworthy", "efficient", "knowledgeable",
    "responsive", "attentive", "generous", "delighted", "satisfied",
    "satisfying", "impressive", "impressed", "superb", "brilliant",
    "good", "nice", "best", "easy", "affordable", "reasonable", "smart",
    "comfortable", "welcoming", "accommodating", "patient", "caring",
    "genuine", "transparent", "flawless", "seamless", "top-notch",
    "topnotch", "exceptional", "stellar", "terrific", "delightful",
    "enjoyable", "beautiful", "spotless", "prompt", "speedy", "painless",
    "hassle-free", "hasslefree", "worth", "value", "gem", "solid",
    "thankful", "grateful", "pleased", "glad", "cheerful", "warm",
    "supportive", "skilled", "expert", "competent", "thorough", "diligent",
    "upfront", "no-pressure", "nopressure", "painfree", "convenient",
    "recommendable", "trustworthy", "dependable", "punctual", "kind",
}

# Multi-word phrases treated as single positive signals.
POSITIVE_PHRASES = {
    "fair price", "great deal", "highly recommend", "no pressure",
    "went above and beyond", "above and beyond", "great service",
    "customer service", "would buy again", "will buy again",
    "peace of mind", "top notch", "worth it", "best experience",
    "great experience", "no hassle", "quick and easy",
}

NEGATIVE_WORDS = {
    "terrible", "awful", "rude", "slow", "overpriced", "disappointed",
    "disappointing", "pushy", "scam", "broken", "worst", "avoid",
    "waste", "horrible", "bad", "poor", "unprofessional", "dishonest",
    "unreliable", "untrustworthy", "shady", "sketchy", "deceptive",
    "misleading", "lying", "liar", "lied", "cheated", "cheating", "cheat",
    "ripoff", "rip-off", "hassle", "frustrating", "frustrated",
    "annoying", "annoyed", "angry", "upset", "unhappy", "regret",
    "regretful", "nightmare", "disaster", "unacceptable", "incompetent",
    "careless", "negligent", "dirty", "damaged", "defective", "faulty",
    "junk", "garbage", "lousy", "mediocre", "subpar", "shoddy",
    "delayed", "late", "unresponsive", "ignored", "ignoring", "dismissive",
    "condescending", "aggressive", "hostile", "threatening", "intimidating",
    "sneaky", "hidden", "fees", "overcharged", "overcharge", "expensive",
    "painful", "difficult", "hard", "complicated", "confusing", "chaotic",
    "disorganized", "unkempt", "unsafe", "risky", "useless", "worthless",
    "never", "refuse", "refused", "cancel", "canceled", "cancelled",
    "problem", "problems", "issue", "issues", "complaint", "complaints",
}

NEGATIVE_PHRASES = {
    "waste of time", "waste of money", "never again", "rip off",
    "ripped off", "hard sell", "high pressure", "bait and switch",
    "hidden fees", "runaround", "run around", "false advertising",
    "would not recommend", "do not recommend", "avoid this",
    "poor customer service", "bad experience", "worst experience",
    "terrible experience",
}

NEGATION_WORDS = {"not", "no", "never", "n't", "cant", "can't", "won't", "wont", "didn't", "didnt"}

_WORD_RE = re.compile(r"[a-zA-Z']+")


def _tokenize(text: str):
    return _WORD_RE.findall(text.lower())


def _count_phrase_hits(lower_text: str, phrases: set) -> int:
    count = 0
    for phrase in phrases:
        count += lower_text.count(phrase)
    return count


def analyze_sentiment(text: str):
    """Return (sentiment, score) for the given text."""
    if text is None or not text.strip():
        return "neutral", 0.0

    lower_text = text.lower()
    tokens = _tokenize(lower_text)

    pos_count = 0
    neg_count = 0

    # Phrase-level matches first (these are strong, unambiguous signals).
    pos_count += _count_phrase_hits(lower_text, POSITIVE_PHRASES)
    neg_count += _count_phrase_hits(lower_text, NEGATIVE_PHRASES)

    # Word-level matches with simple negation handling: if a negation word
    # appears within the previous 2 tokens, flip the polarity of the match.
    for i, tok in enumerate(tokens):
        window_start = max(0, i - 2)
        preceding = tokens[window_start:i]
        negated = any(w in NEGATION_WORDS for w in preceding)

        if tok in POSITIVE_WORDS:
            if negated:
                neg_count += 1
            else:
                pos_count += 1
        elif tok in NEGATIVE_WORDS:
            if negated:
                pos_count += 1
            else:
                neg_count += 1

    total = pos_count + neg_count
    score = (pos_count - neg_count) / max(1, total)
    score = round(score, 4)

    if score > 0.15:
        sentiment = "positive"
    elif score < -0.15:
        sentiment = "negative"
    else:
        sentiment = "neutral"

    return sentiment, score


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------

@app.route("/", methods=["GET"])
def health_check():
    return jsonify({"status": "Sentiment Analyzer is running"}), 200


@app.route("/analyze/<path:text>", methods=["GET"])
def analyze(text):
    if text is None or not text.strip():
        return jsonify({"sentiment": "neutral", "text": "", "score": 0.0}), 200

    sentiment, score = analyze_sentiment(text)
    return jsonify({"sentiment": sentiment, "text": text, "score": score}), 200


# Handle GET /analyze/ or GET /analyze (no text segment) as empty/neutral.
@app.route("/analyze/", methods=["GET"])
@app.route("/analyze", methods=["GET"])
def analyze_empty():
    return jsonify({"sentiment": "neutral", "text": "", "score": 0.0}), 200


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5050)
