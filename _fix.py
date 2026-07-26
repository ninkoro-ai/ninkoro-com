p = r'D:/lifeOS/ninkoro.com/assets/js/edit.js'
s = open(p, encoding='utf-8').read()
lines = s.split('\n')
for i, l in enumerate(lines):
    if 't.value.replace' in l:
        print('BEFORE:', repr(l))
        lines[i] = '    return t.value.replace(/\\u00a0/g, " ").trim();'
        print('AFTER: ', repr(lines[i]))
open(p, 'w', encoding='utf-8', newline='\n').write('\n'.join(lines))
print('done')
