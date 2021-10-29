const proxy = "{{ proxy }}";
const direct = "DIRECT";

const mask = {{ mask }};

const chinaIPs = {
{{#each chinaips}}
  "{{ @key }}": [
    {{#each this}}
      [{{ [0] }}, {{ [1] }}],
    {{/each}}
  ],
{{/each}}
};

function FindProxyForURL(url, host) {
  if (typeof host === 'undefined'
    || isPlainHostName(host) === true // https://developer.mozilla.org/en-US/docs/Web/HTTP/Proxy_servers_and_tunneling/Proxy_Auto-Configuration_PAC_file#isplainhostname
    || host === '127.0.0.1'
    || host === 'localhost') {
    return direct;
  }

  if (dnsDomainIs(host, '.cn')) {
    return direct;
  }

  const resolved = dnsResolve(host);

  if (resolved === '0.0.0.0') {
    return direct;
  }

  const sections = resolved.split('.');

  if (sections.length === 4) {
    const ipLong = sections.reduce((s, x) => s * 256 + Number(x), 0);

    const lst = chinaIPs[String(ipLong & mask)];
    if (lst && lst.length) {
      const index = lst.findIndex(([l, r]) => ipLong >= l && ipLong <= r);
      alert(`${host} : ${resolved} : ${ipLong} : ${index}`);

      if (index > -1) {
        return direct;
      }
    }
  }

  return proxy;
}
