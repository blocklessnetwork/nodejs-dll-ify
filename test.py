import ctypes
import os
from multiprocessing import Process

lib = ctypes.CDLL("build/lib.so")

# # define a call back for the library to call
# def callback_example():
#    print("this is a call back")
#    return 0

# def other():
#    CMPFUNC = ctypes.CFUNCTYPE(ctypes.c_void_p)
#    cmp_func = ctypes.cast(CMPFUNC(callback_example), ctypes.c_void_p)
#    lib.runWithCallback(cmp_func)
#    return 0

# def main():

#    return 0

# if __name__ == '__main__':
#    # CMPFUNC = ctypes.CFUNCTYPE(ctypes.c_void_p, ctypes.c_char_p)
#    # cmp_func = ctypes.cast(CMPFUNC(callback_with_result), ctypes.c_void_p)

#    # lib.runWithCallbackResult.argtypes = [ctypes.c_char_p, cmp_func]

#    # lib.runWithCallbackResult(s, cmp_func)

#    # lib.run.restype = ctypes.c_char_p
#    # lib.run.argtypes = [ctypes.c_char_p]
#    # out = lib.run(s).decode("utf-8")
#    # print(out)

#    Process(target=main).start()
#    Process(target=other).start()


s = "MethodName".encode("UTF-8")
lib.run.restype = ctypes.c_char_p
lib.run.argtypes = [ctypes.c_char_p]
lib.run(s)