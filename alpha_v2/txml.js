function tXml(a, c) {
  function d() {
    for (var c = []; a[b];)
      if (60 == a.charCodeAt(b)) {
        if (47 === a.charCodeAt(b + 1)) {
          b = a.indexOf(">", b);
          b + 1 && (b += 1);
          break;
        } else if (33 === a.charCodeAt(b + 1)) {
          if (45 == a.charCodeAt(b + 2)) {
            for (
              ;
              -1 !== b &&
              (62 !== a.charCodeAt(b) ||
                45 != a.charCodeAt(b - 1) ||
                45 != a.charCodeAt(b - 2) ||
                -1 == b);

            )
              b = a.indexOf(">", b + 1);
            -1 === b && (b = a.length);
          } else for (b += 2; 62 !== a.charCodeAt(b) && a[b];) b++;
          b++;
          continue;
        }
        var d = g();
        c.push(d);
      } else
        (d = b),
          (b = a.indexOf("<", b) - 1),
          -2 === b && (b = a.length),
          (d = a.slice(d, b + 1)),
          0 < d.trim().length && c.push(d),
          b++;
    return c;
  }
  function k() {
    for (var c = b; -1 === m.indexOf(a[b]) && a[b];) b++;
    return a.slice(c, b);
  }
  function g() {
    b++;
    for (var c = k(), g = {}, f = []; 62 !== a.charCodeAt(b) && a[b];) {
      var e = a.charCodeAt(b);
      if ((64 < e && 91 > e) || (96 < e && 123 > e)) {
        var h = k();
        for (
          e = a.charCodeAt(b);
          e &&
          39 !== e &&
          34 !== e &&
          !((64 < e && 91 > e) || (96 < e && 123 > e)) &&
          62 !== e;

        )
          b++, (e = a.charCodeAt(b));
        if (39 === e || 34 === e) {
          e = a[b];
          var l = ++b;
          b = a.indexOf(e, l);
          e = a.slice(l, b);
          if (-1 === b) return { tagName: c, attributes: g, children: f };
        } else (e = null), b--;
        g[h] = e;
      }
      b++;
    }
    47 !== a.charCodeAt(b - 1)
      ? "script" == c
        ? ((f = b + 1),
          (b = a.indexOf("\x3c/script>", b)),
          (f = [a.slice(f, b - 1)]),
          (b += 9))
        : "style" == c
          ? ((f = b + 1),
            (b = a.indexOf("</style>", b)),
            (f = [a.slice(f, b - 1)]),
            (b += 8))
          : -1 == n.indexOf(c) && (b++, (f = d(h)))
      : b++;
    return { tagName: c, attributes: g, children: f };
  }
  function f() {
    var b = new RegExp(
      "\\s" + c.attrName + "\\s*=['\"]" + c.attrValue + "['\"]"
    ).exec(a);
    return b ? b.index : -1;
  }
  c = c || {};
  var b = c.pos || 0,
    m = "\n\t>/= ",
    n = c.noChildNodes || ["img", "br", "input", "meta", "link"],
    h = null;
  if (void 0 !== c.attrValue)
    for (c.attrName = c.attrName || "id", h = []; -1 !== (b = f());)
      (b = a.lastIndexOf("<", b)),
        -1 !== b && h.push(g()),
        (a = a.substr(b)),
        (b = 0);
  else h = c.parseNode ? g() : d();
  c.filter && (h = tXml.filter(h, c.filter));
  c.setPos && (h.pos = b);
  return h;
}
tXml.simplify = function (a) {
  var c = {};
  if (!a.length) return "";
  if (1 === a.length && "string" == typeof a[0]) return a[0];
  a.forEach(function (a) {
    if ("object" === typeof a) {
      c[a.tagName] || (c[a.tagName] = []);
      var d = tXml.simplify(a.children || []);
      c[a.tagName].push(d);
      a.attributes && (d._attributes = a.attributes);
    }
  });
  for (var d in c) 1 == c[d].length && (c[d] = c[d][0]);
  return c;
};
tXml.filter = function (a, c) {
  var d = [];
  a.forEach(function (a) {
    "object" === typeof a && c(a) && d.push(a);
    a.children && ((a = tXml.filter(a.children, c)), (d = d.concat(a)));
  });
  return d;
};
tXml.stringify = function (a) {
  function c(a) {
    if (a)
      for (var g = 0; g < a.length; g++)
        if ("string" == typeof a[g]) d += a[g].trim();
        else {
          var f = void 0,
            b = a[g];
          d += "<" + b.tagName;
          for (f in b.attributes)
            d =
              null === b.attributes[f]
                ? d + (" " + f)
                : -1 === b.attributes[f].indexOf('"')
                  ? d + (" " + f + '="' + b.attributes[f].trim() + '"')
                  : d + (" " + f + "='" + b.attributes[f].trim() + "'");
          d += ">";
          c(b.children);
          d += "</" + b.tagName + ">";
        }
  }
  var d = "";
  c(a);
  return d;
};
tXml.toContentString = function (a) {
  if (Array.isArray(a)) {
    var c = "";
    a.forEach(function (a) {
      c += " " + tXml.toContentString(a);
      c = c.trim();
    });
    return c;
  }
  return "object" === typeof a ? tXml.toContentString(a.children) : " " + a;
};
tXml.getElementById = function (a, c, d) {
  a = tXml(a, { attrValue: c });
  return d ? tXml.simplify(a) : a[0];
};
tXml.getElementsByClassName = function (a, c, d) {
  a = tXml(a, {
    attrName: "class",
    attrValue: "[a-zA-Z0-9- ]*" + c + "[a-zA-Z0-9- ]*",
  });
  return d ? tXml.simplify(a) : a;
};
tXml.getElementByTagName = function (a, c, d) {
  a = tXml(a, { tagName: c });
  return d ? tXml.simplify(a) : a[0];
};