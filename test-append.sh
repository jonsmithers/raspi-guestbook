#!/bin/bash

INPUT_FILE="./sample.log"
OUTPUT_FILE="./auth.log"


touch $OUTPUT_FILE
while read in; do echo "$in" >> $OUTPUT_FILE; sleep 0.001; done < $INPUT_FILE
