#!/bin/bash

# Supabase 연결 정보
HOST="db.esndkknhjnpxslcxcznr.supabase.co"
PORT="5432"
DB="postgres"
USER="postgres"

# 출력 디렉토리
OUTPUT_DIR="./src/db/seed/data"
mkdir -p $OUTPUT_DIR

echo "🔄 Exporting data from Supabase..."

# 비밀번호 입력
read -sp "Enter Supabase DB password: " PASSWORD
echo ""

export PGPASSWORD=$PASSWORD

# Tags (먼저 - FK 의존성)
echo "📌 Exporting tags..."
psql -h $HOST -p $PORT -d $DB -U $USER -c "\COPY (SELECT * FROM public.tags ORDER BY created_at) TO STDOUT WITH CSV HEADER" > $OUTPUT_DIR/tags.csv

# Posts
echo "📝 Exporting posts..."
psql -h $HOST -p $PORT -d $DB -U $USER -c "\COPY (SELECT * FROM public.post ORDER BY created_at) TO STDOUT WITH CSV HEADER" > $OUTPUT_DIR/post.csv

# Post Tags
echo "🔗 Exporting post_tags..."
psql -h $HOST -p $PORT -d $DB -U $USER -c "\COPY (SELECT * FROM public.post_tags ORDER BY created_at) TO STDOUT WITH CSV HEADER" > $OUTPUT_DIR/post_tags.csv

# Daily Visitors
echo "📊 Exporting daily_visitors..."
psql -h $HOST -p $PORT -d $DB -U $USER -c "\COPY (SELECT * FROM public.daily_visitors ORDER BY id) TO STDOUT WITH CSV HEADER" > $OUTPUT_DIR/daily_visitors.csv

# Visitor Logs
echo "👥 Exporting visitor_logs..."
psql -h $HOST -p $PORT -d $DB -U $USER -c "\COPY (SELECT * FROM public.visitor_logs ORDER BY id) TO STDOUT WITH CSV HEADER" > $OUTPUT_DIR/visitor_logs.csv

unset PGPASSWORD

echo ""
echo "✅ Export completed! Files saved to $OUTPUT_DIR"
ls -la $OUTPUT_DIR
