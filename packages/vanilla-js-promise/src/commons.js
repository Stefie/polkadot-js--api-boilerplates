// Our address for Alice on the dev chain
// export const ALICE = '5GoKvZWG5ZPYL1WUovuHW3zJBWBP5eT8CbqjdRY4Q6iMaDtZ';
// export const BOB = '5Gw3s7q4QLkSWwknsiPtjujPv3XM4Trxi5d4PgKMMk3gfGTE';

export const ALICE = '5GrwvaEF5zXb26Fz9rcQpDWS57CtERHpNehXCPcNoHGKutQY';
export const BOB = '5FHneW46xGXgs5mUiveU4sbTyGBzmstUspZC92UhjJM694ty';

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

export const createLog = (content, element = app, className) => {
  console.log(content.replace('<br />', '\n'));
  const p = document.createElement('p');
  p.classList.add('fadeIn');
  if (className) p.classList.add(className);
  p.innerHTML = content;
  element.append(p);
};

export const createButton = (cb, element = app, text = 'Click me') => {
  const button = document.createElement('button');
  const callback = () => {
    console.log(`Button "${text}" clicked!`);
    cb();
  };

  button.innerHTML = text;
  element.appendChild(button);
  button.addEventListener('click', callback);
};

export const createError = (error, element = app) => {
  const textNode = error.type === undefined ? 'Undefined error while tying to fulfill request' : `Error of type ${error.name}:<br />${error.message}`;
  console.error(textNode.replace('<br />', '\n'));
  const p = document.createElement('p');
  p.classList.add('error');
  p.innerHTML = textNode;
  element.append(p);
};
