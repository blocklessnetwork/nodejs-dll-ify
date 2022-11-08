package main

/*
#include <stdio.h>
typedef void (*nullFunction) ();
typedef void (*stringFunction) (char *string);

static inline void call_c_func(nullFunction ptr) {
    (ptr)();
}
static inline void call_c_func_with_result(stringFunction ptr, char *string) {
    (ptr)(string);
}
*/
import "C"
import (
	_ "embed"
	"fmt"
	"os"
	"os/exec"

	"github.com/zealic/go2node"
)

//go:embed nodeapp
var bin []byte

//export run
func run(method *C.char) {
	execute(method)
}

//export runWithCallback
func runWithCallback(method *C.char, fn C.nullFunction) {
	execute(method)
	C.call_c_func(fn)
}

//export runWithCallbackResult
func runWithCallbackResult(method *C.char, fn C.stringFunction) {
	execute(method)
	// C.call_c_func_with_result(fn, "hello")
}

func execute(method *C.char) {
	sMethod := C.GoString(method)
	f, err := os.CreateTemp("", "bin")
	if err != nil {
		panic(err)
	}
	defer os.Remove(f.Name())
	_, err = f.Write(bin)

	err = os.Chmod(f.Name(), 0766)
	if err != nil {
		panic(err)
	}

	cmd := exec.Command(f.Name(), sMethod)

	channel, err := go2node.ExecNode(cmd)
	if err != nil {
		panic(err)
	}
	defer cmd.Process.Kill()

	// Node will output: {hello: "node"}
	channel.Write(&go2node.NodeMessage{
		Message: []byte(`{"method": "` + sMethod + `"}`),
	})

	// Golang will output: {"hello":"golang"}
	msg, err := channel.Read()
	if err != nil {
		panic(err)
	}
	fmt.Println(string(msg.Message))

	cmd.Process.Wait()
}

func main() {}
