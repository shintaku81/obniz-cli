$(() => {
  const term = new Terminal({
    theme: {
      background: '#1D445A'
    },
    cols: 100
  });

  term.open(document.getElementById('terminal'));

  window.onresize = () => {
    const cols = document.getElementsByTagName('body')[0].clientWidth * 0.72 / 7;
    const rows = document.getElementsByTagName('body')[0].clientHeight * 0.4 / 11;
    term.resize(Math.round(cols), Math.round(rows));
  }

  window.electron.stderr((arg) => {
    term.write(arg.replace(/\n/g, '\n\r'));
  });

  window.electron.cmdError(() => {
    $("#errorModal").modal("show");
  });
});
