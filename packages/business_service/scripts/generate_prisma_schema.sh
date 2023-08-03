#!/usr/bin/bash


#===================================================

# This scripts takes all the prisma schemas and generates a file with a valid prisma syntax.
# This is a workaround for the import feature which prisma does not provide.

#===================================================

SCHEMA_FILE=schema.prisma

# Removes all models but leaves the db config 
sed -i '/====/,$d' ./prisma/$SCHEMA_FILE  

echo "//==================================================================================================
//                  This is an autogenerated schema file, do not edit directly. 
//==================================================================================================" >> ./prisma/$SCHEMA_FILE


# Copy all the schemas contents into the main schema file 
for file in prisma/*; do
    # Ignore main file
    if [ `basename $file` == "schema.prisma" ]; then continue
    fi
    # Checks if the $file is actually a file and not a directory
    if [ -f $d ]; then
        # Sed remove any line that contains "import" and then copy to the schema file
        sed "/import/d" $file  >> prisma/schema.prisma
    fi
done