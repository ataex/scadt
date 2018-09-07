# sCADt

## Architecture

### Main
```
Gui         Core      Engine
 |           |          |
 +-+Views    +->Entity  +->Model
 | |         |          |
 | +->Editor +->Palette +->ProgramManager
 | |                    |
 | +->About             +->ViewController
 |                      |
 +-+Components          +->GeometryMaker
   |                    |
   +->LeftPanel         +->ObjParser
   |
   +->StatusBar
   |
   +->FpsMeter
   |
   +->Button
   |
   +->SvgIcon
```
### Objects
```
Geometry     Model              Palette   Entity

vertices     verticesBuffer     Model     Model
indices      indicesBuffer                position
layout       indicesCount                 color
mode         layout
             mode
```
