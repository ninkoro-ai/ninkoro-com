import traceback
p = "D:/lifeOS/ninkoro.com/about.html"
try:
    s = open(p, encoding="utf-8").read()
    print("read ok, len=", len(s))
    start_marker = '<p class="sec-label">USER MANUAL</p>'
    si = s.index(start_marker)
    sec_start = s.rindex('<section class="section">', 0, si)
    print("sec_start=", sec_start)
    end_marker = '</section>\n\n<footer class="footer">'
    ei = s.index(end_marker) + len('</section>')
    print("ei=", ei)
    block = s[sec_start:ei]
    rest = s[:sec_start] + s[ei:]
    anchor = '</header>\n\n<section class="section" style="padding-top: 0;">'
    ai = rest.index(anchor)
    print("ai=", ai)
    new = rest[:ai] + '</header>\n\n' + block + '\n\n' + '<section class="section" style="padding-top: 0;">'
    open(p, "w", encoding="utf-8").write(new)
    print("moved ok, block_len=", len(block))
except Exception:
    traceback.print_exc()
