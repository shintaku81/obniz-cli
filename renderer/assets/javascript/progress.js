$(() => {
  const proceed = (progres_number) => {
    switch(progres_number) {
      case 1:
        $('.bs-wizard-step:nth-child(1)').addClass('complete')
        break;

      case 2:
        $('.bs-wizard-step:nth-child(2)').addClass('active')
        break;

      case 3:
        $('.bs-wizard-step:nth-child(2)').removeClass('active')
        $('.bs-wizard-step:nth-child(2)').addClass('complete')
        break

      case 4:
        $('.bs-wizard-step:nth-child(3)').addClass('active')
        break

      case 5:
        $('.bs-wizard-step:nth-child(3)').removeClass('active')
        $('.bs-wizard-step:nth-child(3)').addClass('complete')
        break

      case 6:
        $('.bs-wizard-step:nth-child(4)').addClass('active')
        break
    }
  }
  window.electron.proceed(proceed);
})


