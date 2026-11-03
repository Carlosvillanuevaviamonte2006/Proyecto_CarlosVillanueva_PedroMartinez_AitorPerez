const esSPA = document.body.dataset.spa === 'true';
if (esSPA) {
  const vistas = document.querySelectorAll('.view');
  const enlaces = document.querySelectorAll('[data-route]');
  function mostrarVista(nombre, enfocar) {
    if (!document.getElementById(nombre)?.classList.contains('view')) nombre = 'inicio';
    vistas.forEach(function(vista) {
      vista.hidden = vista.id !== nombre;
    });
    document.querySelectorAll('.nav-link').forEach(function(enlace) {
      const activo = enlace.dataset.route === nombre;
      enlace.classList.toggle('active', activo);
      if (activo) enlace.setAttribute('aria-current', 'page');
      else enlace.removeAttribute('aria-current');
    });
    document.title = nombre.charAt(0).toUpperCase() + nombre.slice(1) + ' · La vida, despacio';
    if (enfocar) {
      document.querySelector('#contenido').focus();
      window.scrollTo(0, 0);
    }
  }
  enlaces.forEach(function(enlace) {
    enlace.addEventListener('click', function(evento) {
      if (evento.ctrlKey || evento.metaKey || evento.shiftKey || evento.altKey) return;
      evento.preventDefault();
      const nombre = enlace.dataset.route;
      history.pushState(null, '', '#' + nombre);
      mostrarVista(nombre, true);
      const menu = document.querySelector('#menu');
      if (window.bootstrap && menu.classList.contains('show')) bootstrap.Collapse.getOrCreateInstance(menu).hide();
    });
  });
  window.addEventListener('popstate', function() {
    mostrarVista(location.hash.slice(1) || 'inicio', true);
  });
  mostrarVista(location.hash.slice(1) || 'inicio', false);
}
document.querySelectorAll('.reflection-info').forEach(function(boton) {
  boton.addEventListener('click', function() {
    const tarjeta = boton.closest('.card');
    let detalle = tarjeta.querySelector('.detail');
    if (!detalle) {
      detalle = document.createElement('p');
      detalle.classList.add('detail');
      detalle.textContent = tarjeta.dataset.info;
      tarjeta.querySelector('.card-body').appendChild(detalle);
    }
    else {
      detalle.hidden = !detalle.hidden;
    }
    boton.setAttribute('aria-expanded', String(!detalle.hidden));
    boton.textContent = detalle.hidden ? 'Profundizar ↗' : 'Cerrar información ↑';
  });
});
document.querySelectorAll('.reflection-star').forEach(function(boton) {
  boton.addEventListener('click', function() {
    const activo = boton.closest('.card').classList.toggle('destacado');
    boton.setAttribute('aria-pressed', String(activo));
    boton.textContent = activo ? 'Quitar destacado ★' : 'Destacar ☆';
  });
});
document.querySelectorAll('.event-info').forEach(function(boton) {
  boton.addEventListener('click', function() {
    const fila = boton.closest('tr');
    let detalle = fila.querySelector('.detail');
    if (!detalle) {
      detalle = document.createElement('p');
      detalle.classList.add('detail');
      detalle.textContent = fila.dataset.detalle;
      fila.querySelector('th').appendChild(detalle);
    }
    else {
      detalle.hidden = !detalle.hidden;
    }
    boton.setAttribute('aria-expanded', String(!detalle.hidden));
    boton.textContent = detalle.hidden ? 'Ver detalles ↗' : 'Cerrar detalles ↑';
  });
});
document.querySelectorAll('.filter').forEach(function(boton) {
  boton.addEventListener('click', function() {
    document.querySelectorAll('.filter').forEach(function(filtro) {
      filtro.classList.remove('active');
      filtro.setAttribute('aria-pressed', 'false');
    });
    boton.classList.add('active');
    boton.setAttribute('aria-pressed', 'true');
    document.querySelectorAll('tr[data-tipo]').forEach(function(fila) {
      fila.classList.remove('resaltado');
      if (fila.dataset.tipo === boton.dataset.filter) fila.classList.add('resaltado');
    });
    document.querySelector('.filter-status').textContent = boton.dataset.filter === 'todos' ? 'Se ha quitado el destacado.' : 'Destacando: ' + boton.textContent;
  });
});
document.querySelectorAll('form').forEach(function(formulario) {
  formulario.noValidate = true;
  formulario.addEventListener('submit', function(evento) {
    evento.preventDefault();
    const mensaje = formulario.querySelector('.form-message');
    const nombre = formulario.elements.nombre.value.trim();
    const acepto = formulario.elements.acepto;
    let formularioValido = true;
    formulario.querySelectorAll('input, select, textarea').forEach(function(campo) {
      const valor = campo.value.trim();
      const longitudValida = !campo.hasAttribute('minlength') || valor.length >= campo.minLength;
      const obligatorioValido = !campo.required || campo.type === 'checkbox' || valor !== '';
      const valido = campo.checkValidity() && obligatorioValido && (valor === '' && !campo.required || longitudValida);
      if (!valido) formularioValido = false;
      campo.classList.toggle('is-invalid', !valido);
      campo.classList.toggle('is-valid', valido && (campo.type === 'checkbox' ? campo.checked : valor !== ''));
      campo.setAttribute('aria-invalid', String(!valido));
    });
    if (!formularioValido) {
      mensaje.className = 'form-message mt-3 alert alert-danger';
      mensaje.textContent = 'Revisa los campos: nombre de al menos 2 caracteres, correo válido y una opción seleccionada. ' + (acepto ? 'Debes marcar la casilla de simulación.' : 'El mensaje debe tener al menos 10 caracteres sin contar los espacios de los extremos.');
      const primerError = formulario.querySelector('.is-invalid');
      if (primerError) primerError.focus();
      return;
    }
    mensaje.className = 'form-message mt-3 alert alert-success';
    mensaje.textContent = 'Gracias, ' + nombre + '. ' + (acepto ? 'Tu participación se ha simulado correctamente.' : 'Tu mensaje se ha simulado correctamente.') + ' No se han enviado ni guardado datos.';
    formulario.reset();
    formulario.querySelectorAll('input, select, textarea').forEach(function(campo) {
      campo.classList.remove('is-valid', 'is-invalid');
      campo.removeAttribute('aria-invalid');
    });
  });
});
document.querySelectorAll('.breath-toggle').forEach(function(boton) {
  boton.addEventListener('click', function() {
    const activo = document.querySelector('.breath').classList.toggle('running');
    boton.textContent = activo ? 'Terminar la pausa' : 'Empezar la pausa';
    boton.setAttribute('aria-pressed', String(activo));
  });
});
