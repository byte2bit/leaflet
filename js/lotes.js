import { centroid } from "./centroids.js";
import { funcoes, feat, map, heat } from "../main.js";

var centerPoint = [];
var heatmap = {};

export function lotes() {

    $('select[name=lista_lote]').change(function(event) {
        var list_filt_lote = [];
        var lista_lote_emp = [];
        var lst_lote = [];
        var linha1 = "";

        event.preventDefault();

        map.removeLayer(heat);

        var lote = $(this).val();

        var filtr_lote_emp = feat.filter((obj) => {
            if (obj.properties.Desc_Modal == lote) { // recebe lote do click
                return obj.properties.Empreendim;
            }
        });

        var q_uh = [];
        var emp_uh = [];

        for (let i = 0; i < filtr_lote_emp.length; i++) {
            list_filt_lote.push(filtr_lote_emp[i].geometry);
            lst_lote[i] = {
                "type": "Feature",
                "properties": {
                    "Empreendim": filtr_lote_emp[i].properties.Empreendim,
                    "Id_Empreen": filtr_lote_emp[i].properties.Id_Empreen,
                    "NroUHProje": filtr_lote_emp[i].properties.NroUHProje
                },
                ...list_filt_lote[i]
            };
            linha1 += `
            <tr>
            <td class="voa"><a href="#">${lst_lote[i].properties.Id_Empreen}</td>
            <td>${lst_lote[i].properties.Empreendim}</td>
            <td>${lst_lote[i].properties.NroUHProje}</td>
            </tr>`;

            emp_uh.push([lst_lote[i].properties.Empreendim, lst_lote[i].properties.NroUHProje]);

            q_uh.push(lst_lote[i].properties.NroUHProje);

            centerPoint.push({ lat: centroid(filtr_lote_emp[i].properties.Id_Empreen)[1], lng: centroid(filtr_lote_emp[i].properties.Id_Empreen)[0] })
        }

        /**** HEATMAP **************/
        var heat = L.heatLayer(centerPoint, { radius: 25 }).addTo(map);
        /*         var cp = {
                    max: 5,
                    data: centerPoint
                }
                var cfg = {
                    // radius should be small ONLY if scaleRadius is true (or small radius is intended)
                    // if scaleRadius is false it will be the constant radius used in pixels
                    "radius": .2,
                    "maxOpacity": .3,
                    // scales the radius based on map zoom
                    "scaleRadius": true,
                    // if set to false the heatmap uses the global maximum for colorization
                    // if activated: uses the data maximum within the current map boundaries
                    //   (there will always be a red spot with useLocalExtremas true)
                    "useLocalExtrema": false,
                    // which field name in your data represents the latitude - default "lat"
                    latField: 'lat',
                    // which field name in your data represents the longitude - default "lng"
                    lngField: 'lng', */
        // which field name in your data represents the data value - default "value"
        /* valueField: 'count' */
        // };
        map.removeLayer(heat);
/*         heatmap = new HeatmapOverlay(cfg);
                heatmap.addTo(map);
                heatmap.setData(cp); */
        /**** HEATMAP **************/

        for (let i = 0; i < lst_lote.length; i++) {
            lista_lote_emp.push(lst_lote[i].properties.Empreendim);
        }

        funcoes.ordena(lista_lote_emp);
        funcoes.ordena(lst_lote);

        var soma = q_uh.reduce((a, b) => (a + b));

        $("#q_emp").html(lista_lote_emp.length);
        $("#q_uh").html(soma.toLocaleString());

        // //console.log("list_filt_lote: "+JSON.stringify(list_filt_lote))
        var l_lote = L.geoJSON(lst_lote, {
            color: '#800000',
            weigth: 3
        });

        map.eachLayer(function(layer) {
            if (!!layer.toGeoJSON) {
                map.removeLayer(layer);
            }
        });

        l_lote.addTo(map);

        l_lote.eachLayer(function(layer) {
            layer.bindPopup(`<center><p>id:${layer.feature.properties.Id_Empreen}</p><p>${layer.Empreendim}</p><p>${layer.feature.properties.Desc_Geren}</p></center>`);
        });
        $("#tbody").html(linha1);
    });
}