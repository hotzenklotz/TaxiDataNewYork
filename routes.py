import csv
import requests
import time
from multiprocessing import Pool

NUM_PROCESSES = 200

def get_route(foo):
  '''Send a request to the OSRM server to obtain a route between two coordinates'''

  payload = [
    "loc=52.503033,13.420526",
    "loc=52.516582,13.429290",
    "alt=false",
    "instructions=false"
  ]

  # Concat all Query Params
  payload = "&".join(payload)

  try:
    response = requests.get("http://router.project-osrm.org/viaroute", params=payload, timeout=1)
    #print response.json()["route_summary"]["total_distance"]

    return 1

  except Exception, e:
    return 0


def merge_results(results):
  '''Merge all results and write them to disk'''

  pass

if __name__ == "__main__":

  start = time.time()

  i = 0
  f = file("/Users/therold/Google Drive/Uni/Machine Translation/week3/news_10000.csv")
  reader = csv.reader(f)

  print "Starting..."

  # Use a Thread Pool to query multiple routes at once
  pool = Pool(NUM_PROCESSES)

  # Read CSV in batches in a buffer
  read_buffer = []
  write_buffer = []
  while (len(read_buffer) < NUM_PROCESSES):

    try:
      # Read each coordinate pair line by line into the buffer
      read_buffer.append(reader.next())

    except:
      # Stop in case there are no more lines to be read
      results = pool.map(get_route, read_buffer)
      merge_results(results)
      break

    # Start the requests upon filling the buffer
    if len(read_buffer) == NUM_PROCESSES:

      # Send the REST requests in parallel and block until all results are back
      results = pool.map(get_route, read_buffer)
      merge_results(results)

      i += NUM_PROCESSES

      if (i % 1000 == 0):
        print "Processed {0} routes".format(i)

      # Reset batch cache
      read_buffer[:] = []

  elapsed = time.time() - start
  print elapsed
  print i



