import { dasherize } from '@angular-devkit/core/src/utils/strings';
import {
  Rule,
  SchematicContext,
  Tree,
  apply,
  chain,
  externalSchematic,
  mergeWith,
  move,
  template,
  url,
  strings,
} from '@angular-devkit/schematics';

import * as ts from '@schematics/angular/third_party/github.com/Microsoft/TypeScript/lib/typescript';
import { findNodes, insertImport } from '@schematics/angular/utility/ast-utils';
import { InsertChange } from '@schematics/angular/utility/change';

interface CofigurableModuleSchematicOption {
  name: string;
}

function updateModuleFile(
  tree: Tree,
  options: CofigurableModuleSchematicOption,
): Tree {
  const name = dasherize(options.name);
  const moduleFilePath = `src/${name}/${name}.module.ts`;
  const moduleFileContent = tree.readText(moduleFilePath);
  const source = ts.createSourceFile(
    moduleFilePath,
    moduleFileContent,
    ts.ScriptTarget.Latest,
    true,
  );
  const updateRecord = tree.beginUpdate(moduleFilePath);
  const insertImportChange = insertImport(
    source,
    moduleFilePath,
    'ConfigurableModuleClass',
    `./${name}.module-definition`,
  );
  if (insertImportChange instanceof InsertChange) {
    updateRecord.insertRight(insertImportChange.pos, insertImportChange.toAdd);
  }
  const classNode = findNodes(source, ts.SyntaxKind.ClassDeclaration)[0];
  updateRecord.insertRight(
    classNode.end - 2,
    'extends ConfigurableModuleClass ',
  );
  tree.commitUpdate(updateRecord);

  console.log(tree.readText(moduleFilePath));
  return tree;
}

// You don't have to export the function as default. You can also have more than one rule factory
// per file.
export function generate(options: CofigurableModuleSchematicOption): Rule {
  return (_tree: Tree, _context: SchematicContext) => {
    const templateSource = apply(url('./files'), [
      template({ ...options, ...strings }),
      move('src'),
    ]);
    return chain([
      externalSchematic('@nestjs/schematics', 'module', {
        name: options.name,
      }),
      mergeWith(templateSource),
      (tree) => updateModuleFile(tree, options),
    ]);
  };
}
