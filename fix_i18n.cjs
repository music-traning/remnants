const fs = require('fs');
let c = fs.readFileSync('src/contexts/I18nContext.tsx', 'utf8');
c = c.replace("import React, { type ReactNode }, { createContext, useContext, useState } from 'react';", "import React, { type ReactNode, createContext, useContext, useState } from 'react';");
fs.writeFileSync('src/contexts/I18nContext.tsx', c);
