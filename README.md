# R8-Tech Task
## Description
Plot data in a simple DOM using Plotly.js

## Data Interpretation

  - **1º Graph** - *Heater Power Controller* - Due to the quick changes and the dispersion of the values between 0% and 100%, I supposed it can be a power controller.
  As the other values are all associate with temperature, maybe this is a heater power controller.
  - **2º Graph** - *Entrance Room or Leaking Warm Room* - All the Unix timestamps indicates the date was obtained between 2 and 5 am on a 19th of January. Due to the extremely low values only in this graph, I first supposed it was an outside sensor. But it's hard to believe a wheater can variate from -15ºC to 25ºC in two hours. So its more possible this sensor was in an **Entrance Room** which stopped to leak warm maybe because people stopped to pass through, or in a **room with some leak of temperature**, which was closed after 2:30 am. And then, the warm started to grows until the inside ambient temperature.
  - **3º Graph** - *Common Placed Sensor* - Even being so noisy and difficult to see, this data has some stability, the temperature doesn't change over long times, just in short times, maybe for noise in the data collection or some bug in the sensor. But even with this, the data keeps in a static trend which makes me believe this is a **common placed sensor**.
  -  **4º Graph** - *Near Heater Sensor* - This graph is very sensitive to the first graph, which we already supposed is a Heater Controller, so if this temperature grows *drastically* in this graph we can assume it is a **near heater sensor**.