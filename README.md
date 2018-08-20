# sCADt

## Architecture

### Main
```
Views   Components     Engine             Core
  |         |            |                 |
  +->About  +->LeftPanel +->ViewController +->Entity
  |         |            |                 |
  +->Editor +->Button    +->ProgramManager +->Palette
            |            |
            +->SvgIcon   +->GeometryMaker
                         |
                         +->ObjParser
```
### Objects
```
Geometry +-> Model +--------+   Palette   Entity
                            |
vertices     verticesBuffer +-> Model <-@ Model
indices      indicesBuffer                position
layout       indicesCount                 color
mode         layout
             mode
```
