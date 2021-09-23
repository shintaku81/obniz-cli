$(() => {
  if($('.user-menu.disabled').length === 0) {
    const userinfo = window.electron.userinfo();
    if(userinfo) {
      const html = `
              <ul>
                <li>User:</li>
                <li>
                  <ul>
                    <li><%= name %></li>
                    <li><%= email %></li>
                    <li><a href="#">update account</a></li>
                  </ul>
                </li>
              </ul>
        `;

      $('#userinfo').html(ejs.render(html, {name: userinfo.name, email: userinfo.email}));
    }
  }
});
