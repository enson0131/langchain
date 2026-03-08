#!/bin/zsh
source "$(dirname "$0")/venv/bin/activate"

if [ -n "$1" ]; then
    python "$1"
else
    echo "Usage: ./run.sh <script.py>"
    echo "Example: ./run.sh langGraph/agent-demo-天气tools.py"
fi
