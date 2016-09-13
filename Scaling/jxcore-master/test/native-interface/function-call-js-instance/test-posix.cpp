// Copyright & License details are available under JXCORE_LICENSE file
#include "../commons/common-posix.h"

void callback(JXValue *results, int argc) {
  // do nothing
}

static int counter = 0;

// native JavaScript method we'll be calling from JS land
void sampleMethod(JXValue *results, int argc) {
  assert(argc == 4 && "number of arguments supposed to be 4");

  assert(JX_IsFunction(&results[0]) && JX_IsFunction(&results[1]) &&
         "both parameters supposed to be a function");

  assert(JX_IsString(&results[2]) && JX_IsString(&results[3]) &&
         "both parameters supposed to be a function");

  bool JX_CallFunction(JXValue * fnc, JXValue * params, const int argc,
                       JXValue * out);

  JXValue out;
  assert(JX_CallFunction(&results[0], &results[2], 1, &out) &&
         "failed while calling console.log");
  assert(JX_IsUndefined(&out) &&
         "return value from console.log should be undefined");

  assert(JX_CallFunction(&results[0], &results[3], 1, &out) &&
         "failed while calling console.error");
  assert(JX_IsUndefined(&out) &&
         "return value from console.error should be undefined");

  counter++;
}

const char *contents =
    "console.log('hello world from:', process.threadId); \n"
    "global.webview = {}; \n"
    "setTimeout(function(){},10);\n"
    "webview.call = function() { \n"
    "  process.natives.sampleMethod(arguments[0], arguments[1], 'normal', "
    "'error');\n"
    "};\n"
    "jxcore.tasks.runOnce(function(){"
    "  process.natives.sampleMethod(console.log, console.error, 'normal', 'error');\n"
    "});";

const char *eval_str = "webview.call(console.log, console.error);";

int main(int argc, char **args) {
  JX_Initialize(args[0], callback);
  JX_InitializeNewEngine();

  JX_DefineMainFile(contents);
  JX_DefineExtension("sampleMethod", sampleMethod);
  JX_StartEngine();

  // loop for possible IO
  // or JX_Loop() without usleep / while
  while (JX_LoopOnce() != 0) usleep(1);

  JXValue result;
  JX_Evaluate(eval_str, "myscript", &result);
  JX_Free(&result);

  // loop for possible IO
  // or JX_Loop() without usleep / while
  while (JX_LoopOnce() != 0) usleep(1);

  JX_StopEngine();

  assert(counter == 3 && "sampleMethod is expected to recive 3 calls (2 sub instance, 1 main)");
}
