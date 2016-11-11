import Node from '../Node.js'

export default class WithStatement extends Node {
  transpile (code, transforms) {
    if (transforms.stripWith) {
      const fn = this.parent && this.parent.parent
      if (fn && fn.type === 'FunctionDeclaration' && fn.id.name === 'render') {
        this.program.inWith = true
        // remove surrounding with block
        code.remove(this.start, this.body.start + 1)
        code.remove(this.end - 1, this.end)
        const name = this.findScope(true).createIdentifier('$$vm')
        code.insertRight(this.start, `var ${name}=this;`)
      }
      super.transpile(code, transforms)
      this.program.inWith = false
    }
  }
}