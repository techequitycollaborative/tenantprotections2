How to use:

1. Create a csv file for the desired conversion. See the sample for row format. For example, if converting rentcaps from csv to json, create a file that follows the format in "rentcap_sample", name it "rentcap.csv", and place it in this folder.

2. Run the desired conversion script, for example:

	> python csv_to_json_rentcap.py

3. This will result in a json file. (In this example, "rentcap.json".) Replace the appropriate file in the /data/ directory.

4. Merge changes and redeploy the site.