
import { centroid } from "./centroids.js";
import { funcoes, feat, map, heat } from "../main.js";

var centerPoint = [];

export function regioes() {

    $('select[name=lista_ra]').on('change', function (event) {

        // map.removeLayer(heat);

        var list_filt_ra = [];
        var lista_ra_emp = [];
        var lst_ra = [];
        var linha1 = "";

        event.preventDefault();

        var ra = $(this).val();

        var filtr_ra_emp = feat.filter((obj) => {
            if (obj.properties.Desc_RA == ra) { // recebe ra do click
                return obj.properties.Empreendim;
            }
        });

        var q_uh = [];
        var emp_uh = [];

        for (let i = 0; i < filtr_ra_emp.length; i++) {
            list_filt_ra.push(filtr_ra_emp[i].geometry);
            lst_ra[i] = {
                "type": "Feature",
                "properties": {
                    "Empreendim": filtr_ra_emp[i].properties.Empreendim,
                    "Id_Empreen": filtr_ra_emp[i].properties.Id_Empreen,
                    "NroUHProje": filtr_ra_emp[i].properties.NroUHProje
                },
                ...list_filt_ra[i]
            };
            linha1 += `
            <tr>
            <td class="voa"><a href="#">${lst_ra[i].properties.Id_Empreen}</td>
            <td>${lst_ra[i].properties.Empreendim}</td>
            <td>${lst_ra[i].properties.NroUHProje}</td>
            </tr>`;

            emp_uh.push([lst_ra[i].properties.Empreendim, lst_ra[i].properties.NroUHProje]);

            q_uh.push(lst_ra[i].properties.NroUHProje);

            centerPoint.push([centroid(filtr_ra_emp[i].properties.Id_Empreen)[1], centroid(filtr_ra_emp[i].properties.Id_Empreen)[0]])
        }

        /**** HEATMAP **************/
        heat.setLatLngs(centerPoint);

        for (let i = 0; i < lst_ra.length; i++) {
            lista_ra_emp.push(lst_ra[i].properties.Empreendim);
        }

        funcoes.ordena(lista_ra_emp);
        funcoes.ordena(lst_ra);

        var soma = q_uh.reduce((a, b) => (a + b));

        $("#q_emp").html(lista_ra_emp.length);
        $("#q_uh").html(soma.toLocaleString());

        // //console.log("list_filt_ra: "+JSON.stringify(list_filt_ra))
        var l_ra = L.geoJSON(lst_ra, {
            color: '#800000',
            weigth: 3
        });

        map.eachLayer(function (layer) {
            if (!!layer.toGeoJSON) {
                map.removeLayer(layer);
            }
        });

        l_ra.addTo(map);

        l_ra.eachLayer(function (layer) {
            layer.bindPopup(`<center><p>id:${layer.feature.properties.Id_Empreen}</p><p>${layer.Empreendim}</p><p>${layer.feature.properties.Desc_Geren}</p></center>`);
        });
        $("#tbody").html(linha1);
    });
}