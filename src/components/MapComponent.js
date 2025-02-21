
import React, { useEffect } from 'react';
import * as d3 from 'd3';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

const MapComponent = () => {
  useEffect(() => {
    // Initialize the map
    const map = L.map('map', {
      zoomControl: false,
      scrollWheelZoom: false,
      doubleClickZoom: false,
      dragging: false,
      attributionControl: false,
      maxBounds: [[-90, -180], [90, 180]],
      maxBoundsViscosity: 1.0
    }).setView([40, 0], 1.5);

    // Create a pane for the background layer
    map.createPane('backgroundPane');
    map.getPane('backgroundPane').style.zIndex = 100;

    // Add a solid-colored rectangle to cover the entire map
    L.rectangle([[-90, -180], [90, 180]], {
      color: '#000000',
      fillColor: '#000000',
      fillOpacity: 1,
      pane: 'backgroundPane'
    }).addTo(map);

    // Fetch and add geoJSON data to the map
    fetch('https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson')
      .then(response => response.json())
      .then(data => {
        L.geoJSON(data, {
          style: {
            color: '#4A90E2',
            weight: 0.5,
            fillColor: '#000000',
            fillOpacity: 0.5
          },
          onEachFeature: function (feature, layer) {
            layer.on({
              mouseover: function () {
                layer.setStyle({
                  color: '#4A90E2',
                  weight: 1.5,
                  dashArray: '5, 5',
                  fillColor: '#4A90E2',
                  fillOpacity: 0.5
                });
              },
              mouseout: function () {
                layer.setStyle({
                  color: '#4A90E2',
                  weight: 0.5,
                  dashArray: '',
                  fillColor: '#000000',
                  fillOpacity: 0.5
                });
              }
            });
          }
        }).addTo(map);
      });

    // Create an SVG layer on top of Leaflet
    const svgLayer = d3.select(map.getPanes().overlayPane).append("svg"),
      g = svgLayer.append("g").attr("class", "leaflet-zoom-hide");

    // Define the attack data with source, destination, names, and threat type
    let attackData = [
        { "id": 1, "source": [37.7749, -122.4194], "destination": [40.7128, -74.0060], "sourceName": "USA", "destinationName": "USA", "threatType": "malware" },
        { "id": 2, "source": [51.5074, -0.1278], "destination": [48.8566, 2.3522], "sourceName": "UK", "destinationName": "France", "threatType": "phishing" },
        { "id": 3, "source": [35.6895, 139.6917], "destination": [37.5665, 126.9780], "sourceName": "Japan", "destinationName": "South Korea", "threatType": "exploit" },
        { "id": 4, "source": [-33.9249, 18.4241], "destination": [28.6139, 77.2090], "sourceName": "South Africa", "destinationName": "India", "threatType": "malware" },
        { "id": 5, "source": [34.0522, -118.2437], "destination": [-33.8688, 151.2093], "sourceName": "USA", "destinationName": "Australia", "threatType": "phishing" },
        { "id": 6, "source": [55.7558, 37.6176], "destination": [28.6139, 77.2090], "sourceName": "Russia", "destinationName": "India", "threatType": "exploit" },
        { "id": 7, "source": [28.6139, 77.2090], "destination": [55.7558, 37.6176], "sourceName": "India", "destinationName": "Russia", "threatType": "malware" },
        { "id": 8, "source": [37.7749, -122.4194], "destination": [55.7558, 37.6176], "sourceName": "USA", "destinationName": "Russia", "threatType": "phishing" },
        { "id": 9, "source": [40.7128, -74.0060], "destination": [52.5200, 13.4050], "sourceName": "USA", "destinationName": "Germany", "threatType": "ransomware" },
        { "id": 10, "source": [34.0522, -118.2437], "destination": [51.1657, 10.4515], "sourceName": "USA", "destinationName": "Germany", "threatType": "exploit" },
        { "id": 11, "source": [55.7558, 37.6176], "destination": [41.9028, 12.4964], "sourceName": "Russia", "destinationName": "Italy", "threatType": "malware" },
        { "id": 12, "source": [48.8566, 2.3522], "destination": [35.6895, 139.6917], "sourceName": "France", "destinationName": "Japan", "threatType": "phishing" },
        { "id": 13, "source": [-34.6037, -58.3816], "destination": [40.4168, -3.7038], "sourceName": "Argentina", "destinationName": "Spain", "threatType": "exploit" },
        { "id": 14, "source": [39.9042, 116.4074], "destination": [55.7558, 37.6176], "sourceName": "China", "destinationName": "Russia", "threatType": "malware" },
        { "id": 15, "source": [37.7749, -122.4194], "destination": [34.0522, -118.2437], "sourceName": "USA", "destinationName": "USA", "threatType": "ransomware" },
        { "id": 16, "source": [35.6895, 139.6917], "destination": [51.5074, -0.1278], "sourceName": "Japan", "destinationName": "UK", "threatType": "phishing" },
        { "id": 17, "source": [48.8566, 2.3522], "destination": [28.6139, 77.2090], "sourceName": "France", "destinationName": "India", "threatType": "exploit" },
        { "id": 18, "source": [55.7558, 37.6176], "destination": [40.7128, -74.0060], "sourceName": "Russia", "destinationName": "USA", "threatType": "malware" },
        { "id": 19, "source": [37.7749, -122.4194], "destination": [-33.9249, 18.4241], "sourceName": "USA", "destinationName": "South Africa", "threatType": "phishing" },
        { "id": 20, "source": [40.7128, -74.0060], "destination": [34.0522, -118.2437], "sourceName": "USA", "destinationName": "USA", "threatType": "exploit" },
        { "id": 21, "source": [51.5074, -0.1278], "destination": [34.0522, -118.2437], "sourceName": "UK", "destinationName": "USA", "threatType": "ransomware" }
      ];

    let currentIndex = 0;

    
    const defaultSpeed = 1500; 

    // Define the projection from geographical coordinates (lat, lon) to screen points
    function projectPoint(latlng) {
      const point = map.latLngToLayerPoint(new L.LatLng(latlng[0], latlng[1]));
      return [point.x, point.y];
    }

    // Function to redraw the attack lines and reposition the SVG
    function reset() {
      const bounds = map.getBounds(),
        topLeft = map.latLngToLayerPoint(bounds.getNorthWest()),
        bottomRight = map.latLngToLayerPoint(bounds.getSouthEast());

      svgLayer
        .attr('width', bottomRight.x - topLeft.x)
        .attr('height', bottomRight.y - topLeft.y)
        .style('left', `${topLeft.x}px`)
        .style('top', `${topLeft.y}px`);

      g.attr('transform', `translate(${-topLeft.x}, ${-topLeft.y})`);

      showNextAttack();
    }

    // Function to display the next attack after the previous one reaches the destination
    function showNextAttack() {
      if (currentIndex >= attackData.length) {
        currentIndex = 0; // Reset if we reach the end of the attack data
      }

      const attack = attackData[currentIndex];
      currentIndex++; 
      const source = projectPoint(attack.source);
      const destination = projectPoint(attack.destination);

      // Mid-point for curvature
      const midPoint = [
        (source[0] + destination[0]) / 2 + 100,
        (source[1] + destination[1]) / 2
      ];

      // Set color based on threat type
      let lineColor;
      switch (attack.threatType) {
        case 'malware':
          lineColor = 'red';
          break;
        case 'phishing':
          lineColor = 'purple';
          break;
        case 'exploit':
          lineColor = 'yellow';
          break;
        default:
          lineColor = 'white';
      }

      // Create line generator for curved path
      const lineGenerator = d3.line()
        .curve(d3.curveBundle.beta(1))
        .x(d => d[0])
        .y(d => d[1]);

      // Add attack line to SVG
      const path = g.append("path")
        .datum([source, midPoint, destination])
        .attr("class", "attack-line")
        .attr("d", lineGenerator)
        .attr("stroke", lineColor)
        .attr("stroke-width", 2)
        .attr("stroke-dasharray", function () {
          return this.getTotalLength();
        })
        .attr("stroke-dashoffset", function () {
          return this.getTotalLength();
        })
        .transition()
        .duration(defaultSpeed)  
        .ease(d3.easeLinear)
        .attr("stroke-dashoffset", 0)
        .on("end", function() {
          d3.select(this).remove(); 
          showNextAttack();
        });

      const attackInfo = `${attack.sourceName} ➔ ${attack.destinationName} (${attack.threatType})`;
      d3.select("#activeAttacksList").append("li").text(attackInfo).transition().duration(1000).remove(); 
    }

    document.getElementById('updateAttacks').addEventListener('click', () => {
      showNextAttack(); 
    });

    map.on("moveend", reset);
    reset(); 

    return () => {
      map.off('moveend', reset);
      map.remove(); 
    };
  }, []);

  return (
    <div id="map" style={{ height: '80vh', width: '100%' }}></div>
  );
};

export default MapComponent;
