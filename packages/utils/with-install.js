export default component => {
  component.install = app => {
    app.component(component.name, component)
  }
  return component
}
