// 远程加载highcharts及3d组件

const chartCached = {};

export default function load(src) {
  return new Promise((resolve, reject)=>{
    const cached = chartCached[src];
    if(cached) {
      return resolve()
    }
    var script = document.createElement('script');
    script.type = "text/javascript";
    script.onload = function() {
      chartCached[src] = true;
      resolve();
    };
    script.onerror = reject;
    script.src = src;
    document.body.appendChild(script);
  })
}