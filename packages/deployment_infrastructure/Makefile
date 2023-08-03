SHELL = /bin/sh
default: ./cli/turnazos.sh
		 	sed "s|<DIR>|$(PWD)|" ./cli/turnazos.sh > generated.sh && sudo cp ./generated.sh /usr/bin/turnazos && rm generated.sh
