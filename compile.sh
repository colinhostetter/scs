for file in  *.yaml; do
    yq "$file" -P -o=json > "data/$(echo $file | sed s/.yaml//)".json
done

tsc --outDir dist
