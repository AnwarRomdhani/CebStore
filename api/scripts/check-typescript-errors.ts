#!/usr/bin/env ts-node

/**
 * TypeScript Error Checker
 * Validates the entire codebase for TypeScript compilation errors
 */

import * as child_process from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

interface TsError {
  fileName: string;
  line: number;
  character: number;
  message: string;
}

function runTypeScriptValidation(): void {
  console.log('🔍 Running TypeScript validation...\n');

  try {
    // Run TypeScript compiler with --noEmit flag to check for errors without emitting files
    const result = child_process.spawnSync('npx', ['tsc', '--noEmit'], {
      cwd: process.cwd(),
      encoding: 'utf-8',
    });

    if (result.status === 0) {
      console.log('✅ No TypeScript errors found!');
      console.log('✅ Backend is fully type-safe!');
      process.exit(0);
    } else {
      console.error('❌ TypeScript compilation errors found:');
      console.error(result.stdout || result.stderr);
      
      // Parse errors for detailed report
      const errors = parseTsErrors(result.stderr || result.stdout);
      generateErrorReport(errors);
      
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error running TypeScript validation:', error);
    process.exit(1);
  }
}

function parseTsErrors(output: string): TsError[] {
  const errors: TsError[] = [];
  const errorRegex = /(.+\.ts)\((\d+),(\d+)\):\s*(.+)$/gm;
  
  let match;
  while ((match = errorRegex.exec(output)) !== null) {
    errors.push({
      fileName: match[1],
      line: parseInt(match[2]),
      character: parseInt(match[3]),
      message: match[4],
    });
  }
  
  return errors;
}

function generateErrorReport(errors: TsError[]): void {
  console.log('\n📋 TypeScript Error Report:');
  console.log('=' .repeat(50));
  
  errors.forEach((error, index) => {
    console.log(`${index + 1}. File: ${error.fileName}`);
    console.log(`   Line: ${error.line}, Column: ${error.character}`);
    console.log(`   Error: ${error.message}`);
    console.log('');
  });
  
  console.log(`Total Errors: ${errors.length}`);
  console.log('\n💡 Please fix these TypeScript errors before proceeding.');
}

// Run the validation
runTypeScriptValidation();