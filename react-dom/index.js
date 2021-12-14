import Component from "../react/Component";
const ReactDom ={
  render
}


function render(vNode,container) {
  return container.appendChild(_render(vNode))
}

function renderComponent(comp) {
  let base
  const render = comp.render()
  base = _render(render);
  comp.base = base;
  return comp
}
//创建组件
function createComponent(comp,props) {
  //如果是类组件 则创建实例，返回
  let inst ;
  if (comp.prototype && comp.prototype.render){
    inst=new comp(props)
  }else {
    //如果是函数组件 将函数拓展为类组件 方便后面统一管理
    inst = new Component(props);
    inst.constructor = comp
    inst.render = function (){
      return this.constructor( )
    }
  }
  return inst
}
//设置组件属性
function setComponentProps(comp,props) {
  comp.props = props
  renderComponent(comp)
}
function _render(vNode,container) {
  //未定义node的情况
  if (vNode===undefined||vNode===null||typeof vNode==="boolean") return''

  if (typeof vNode.tag === "function"){
    /*
    * 1、创建组件
    *2、设置组件的属性
    * 3、组件渲染的节点对象返回
    * */
    const comp = createComponent(vNode.tag,vNode.attrs)

    setComponentProps(comp,vNode.attrs);
    return comp.base;

  }

  //如果node是文本内容，就渲染对用的文本内容
  if (typeof vNode==='string'){
    return document.createTextNode(vNode);
  }
  //否则创建对应虚拟dom
  const {tag} = vNode;
  const vDom = document.createElement(tag);

  if(vNode.attrs){
    Object.keys(vNode.attrs).forEach(key=>{
      const val = vNode.attrs[key];
      setDomAttribute(vDom,key,val)
    })
  }
  vNode.children.forEach(child=>render(child,vDom))
  return vDom
}

function setDomAttribute(vDom,key,val) {
  /*替换classname 为class*/
  if (key==="className"){
    key = "class"
  }
  /*处理节点事件*/
  if (/on\w+/.test(key)){
    key = key.toLowerCase();
    vDom[key] = val || ''
  }else if (key==='style'){
    if (!val||typeof val ==='string'){
      vDom.style.cssText = val;
    }else if (val&&typeof val==="object"){
      for (let styleParam in val){
        typeof val[styleParam]==="number"? vDom.style[styleParam] = val[styleParam]+'px':vDom.style[styleParam]= val[styleParam]
      }
    }else {
      if (key in vDom){
        vDom[key] = val || ''
      }
      if (val){
        vDom.setAttribute(key,val)
      }else {
        vDom.removeAttribute(key)
      }
    }
  }

}
export default ReactDom