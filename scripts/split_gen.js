const { writeFileSync } = require("fs");
const { read_aod, id, hash_string } = require("./common.js");

const OUTPUT = "minidb";
const OUTPUT_MINIFIED = "minidb-minified"
const BUCKETS = 1024;

let splits = [];
for(let i = 0; i < BUCKETS; i++) splits[i] = { data: [] };

read_aod().forEach(entry => {
    const id_entry = {
        ...entry,
        "id": id(entry.sources)
    };
    const hash = hash_string(id_entry.id);
    let bucket = parseInt(hash.substr(0, 8), 16) % BUCKETS;
    splits[bucket].data.push(id_entry);
});

for(let i in splits) {
    const json = JSON.stringify(splits[i], null, 2);
    writeFileSync(`${OUTPUT}/${i}.json`, json);
    const jsonMinified = JSON.stringify(splits[i]);
    writeFileSync(`${OUTPUT_MINIFIED}/${i}.json`, jsonMinified);
}