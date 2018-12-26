// Our address for Alice on the dev chain
export const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
export const BOB = '5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE';

const app = document.querySelector('#content');

export const createWrapper = (wrapperClass, headline) => {
  const div = document.createElement('div');
  const head = document.createElement('h2');
  head.textContent = headline || wrapperClass;
  div.classList.add('wrapper', wrapperClass);
  div.append(head);
  app.appendChild(div);
  return div;
};

export const createElement = (content, element = app, className) => {
  console.log(content);
  const p = document.createElement('p');
  if (className) {
    p.classList.add(className);
  }
  p.innerHTML = content;
  element.append(p);
};
